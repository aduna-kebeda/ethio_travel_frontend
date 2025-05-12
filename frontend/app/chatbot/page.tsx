"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Send, ArrowLeft, MapPin, Calendar, Clock, CloudSun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"

type Message = {
  id: string
  text: string
  sender: "user" | "bot" | "system"
  timestamp: Date
}

type QuickReply = {
  id: string
  text: string
}

// Function to generate a proper UUID v4
function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback implementation for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { getAccessToken } = useAuth()

  // API base URL
  const API_BASE_URL = "https://ai-driven-travel.onrender.com/api/chatbot"

  const getAuthToken = () => {
    return getAccessToken()
  }

  useEffect(() => {
    // Load conversation history or start a new session
    const initializeChat = async () => {
      const token = getAuthToken()

      // If no token, show a message asking the user to log in
      if (!token) {
        setMessages([
          {
            id: Date.now().toString(),
            text: "Welcome to EthioTravel Assistant! Please log in to access personalized travel assistance.",
            sender: "bot",
            timestamp: new Date(),
          },
        ])

        setQuickReplies([
          { id: "login", text: "Log in" },
          { id: "signup", text: "Sign up" },
          { id: "browse", text: "Continue browsing" },
        ])

        return
      }

      // Check for existing session ID in localStorage
      const storedSessionId = localStorage.getItem("chatbot_session_id")

      // Validate if it's a proper UUID
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storedSessionId || "")

      if (storedSessionId && isValidUUID) {
        setSessionId(storedSessionId)
        await fetchConversationHistory(storedSessionId)
      } else {
        // Generate a proper UUID for the session
        const newSessionId = generateUUID()
        setSessionId(newSessionId)
        localStorage.setItem("chatbot_session_id", newSessionId)

        // Start a new session with an initial message
        await sendMessage("Hello", false)
      }
    }

    initializeChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Update the fetchConversationHistory function to use the correct authentication
  const fetchConversationHistory = async (sessionId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error("No authentication token found")
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "Authentication required. Please log in to continue.",
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        return
      }

      const response = await fetch(`${API_BASE_URL}/message/history/?session_id=${sessionId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const mappedMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.content,
          sender: msg.sender as "user" | "bot",
          timestamp: new Date(msg.created_at),
        }))
        setMessages(mappedMessages)
      } else {
        const errorData = await response.json()
        console.error("Error fetching history:", errorData.error)

        if (response.status === 403 || response.status === 404) {
          localStorage.removeItem("chatbot_session_id")
          setSessionId(null)

          // Generate a proper UUID for the session
          const newSessionId = generateUUID()
          setSessionId(newSessionId)
          localStorage.setItem("chatbot_session_id", newSessionId)

          await sendMessage("Hello", false)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `Failed to load conversation history. Please try again later.`,
              sender: "bot",
              timestamp: new Date(),
            },
          ])
        }
      }
    } catch (error) {
      console.error("Network error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Network error. Please check your connection and try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }

  // Update the sendMessage function to use the correct authentication
  const sendMessage = async (messageText: string, showInUI = true) => {
    if (messageText.trim() === "") return

    let userMessage: Message | null = null
    if (showInUI) {
      userMessage = {
        id: Date.now().toString(),
        text: messageText,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage!])
      setInputValue("")
      setQuickReplies([])
      setIsTyping(true)
    }

    try {
      const token = getAuthToken()
      if (!token) {
        // Handle unauthenticated user more gracefully
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Please log in to continue using the chatbot. You can create an account or log in to access personalized travel assistance.",
              sender: "bot",
              timestamp: new Date(),
            },
          ])

          // Add login options
          setQuickReplies([
            { id: "login", text: "Log in" },
            { id: "signup", text: "Sign up" },
            { id: "browse", text: "Continue browsing" },
          ])

          setIsTyping(false)
        }, 1000)
        return
      }

      // Ensure we have a valid session ID (UUID format)
      if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
        const newSessionId = generateUUID()
        setSessionId(newSessionId)
        localStorage.setItem("chatbot_session_id", newSessionId)
      }

      const response = await fetch(`${API_BASE_URL}/message/message/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          id: Date.now().toString(),
          text: data.response.content || "Sorry, I didn't understand that. Please try again.",
          sender: "bot",
          timestamp: new Date(data.response.timestamp),
        }
        setMessages((prev) => [...prev, botMessage])

        // Only update session ID if it's different and valid
        if (
          data.session_id &&
          data.session_id !== sessionId &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.session_id)
        ) {
          setSessionId(data.session_id)
          localStorage.setItem("chatbot_session_id", data.session_id)
        }

        // Set quick replies from API response (assuming suggestions are provided)
        const newQuickReplies = data.response.suggestions
          ? data.response.suggestions.map((s: string, index: number) => ({
              id: `sugg${index + 1}`,
              text: s,
            }))
          : [
              { id: "qr1", text: "Visa requirements" },
              { id: "qr2", text: "Currency information" },
              { id: "qr3", text: "Safety tips" },
              { id: "qr4", text: "Check weather" },
              { id: "qr5", text: "Speak to a human" },
            ]
        setQuickReplies(newQuickReplies)
      } else {
        const errorText = await response.text()
        console.error("Error sending message:", errorText)

        if (errorText && errorText.includes("Must be a valid UUID")) {
          // Handle UUID validation error
          const newSessionId = generateUUID()
          setSessionId(newSessionId)
          localStorage.setItem("chatbot_session_id", newSessionId)

          // Try sending the message again with the new session ID
          setTimeout(() => {
            sendMessage(messageText, false)
          }, 500)

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "Reconnecting to chat service...",
              sender: "system",
              timestamp: new Date(),
            },
          ])
        } else {
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: "I'm having trouble processing your request. Let me try again.",
            sender: "system",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])

          // Set default quick replies on error
          setQuickReplies([
            { id: "qr1", text: "Visa requirements" },
            { id: "qr2", text: "Currency information" },
            { id: "qr3", text: "Safety tips" },
            { id: "qr4", text: "Check weather" },
            { id: "qr5", text: "Speak to a human" },
          ])
        }
      }
    } catch (error) {
      console.error("Network error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Network error. Please check your connection and try again.",
        sender: "system",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      // Set default quick replies on error
      setQuickReplies([
        { id: "qr1", text: "Visa requirements" },
        { id: "qr2", text: "Currency information" },
        { id: "qr3", text: "Safety tips" },
        { id: "qr4", text: "Check weather" },
        { id: "qr5", text: "Speak to a human" },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    sendMessage(inputValue)
  }

  // Update the handleQuickReplyClick function to handle login/signup options
  const handleQuickReplyClick = (reply: QuickReply) => {
    // Handle authentication-related quick replies
    if (reply.id === "login") {
      router.push("/login")
      return
    } else if (reply.id === "signup") {
      router.push("/signup")
      return
    } else if (reply.id === "browse") {
      router.push("/")
      return
    }

    sendMessage(reply.text)
  }

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">EthioTravel AI Assistant</h1>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : message.sender === "system" ? "justify-center" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.sender === "system" ? (
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-100 text-gray-600 text-sm">
                  <p>{message.text}</p>
                </div>
              ) : (
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === "user" ? "bg-[#E91E63] text-white" : "bg-white shadow-sm"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              className="mb-4 flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-lg px-4 py-2 bg-white shadow-sm">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          {quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {quickReplies.map((reply) => (
                <motion.button
                  key={reply.id}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => handleQuickReplyClick(reply)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Dynamically assign icons based on reply text */}
                  {reply.text.toLowerCase().includes("visa") && <MapPin className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("weather") && <CloudSun className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("tour") && <Calendar className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("cost") ||
                    (reply.text.toLowerCase().includes("currency") && <Clock className="inline h-3 w-3 mr-1" />)}
                  {reply.text.toLowerCase().includes("human") && <User className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("safety") && <User className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("gondar") && <MapPin className="inline h-3 w-3 mr-1" />}
                  {reply.text}
                </motion.button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-l-full"
                disabled={isTyping}
              />
              <Button
                type="submit"
                className="bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-r-full"
                disabled={inputValue.trim() === "" || isTyping}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
