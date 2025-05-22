"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, MapPin, Calendar, Clock, CloudSun, User, ArrowDown } from "lucide-react"
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
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Parse markdown-like text to HTML with sanitization
const parseMarkdown = (text: string): string => {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\* (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n/g, "<br />")
  formatted = formatted.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  return formatted
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef(0)
  const userHasScrolled = useRef(false)
  const router = useRouter()
  const { getAccessToken } = useAuth()

  const API_BASE_URL = "https://ai-driven-travel.onrender.com/api/chatbot"

  const getAuthToken = () => {
    return getAccessToken()
  }

  // Generate contextual quick replies
  const getContextualQuickReplies = (messageText: string): QuickReply[] => {
    if (messageText.toLowerCase().includes("weather")) {
      return [
        { id: "weather-addis", text: "Weather in Addis Ababa" },
        { id: "weather-gondar", text: "Weather in Gondar" },
        { id: "weather-lalibela", text: "Weather in Lalibela" },
        { id: "weather-bahir", text: "Weather in Bahir Dar" },
      ]
    } else if (messageText.toLowerCase().includes("visa")) {
      return [
        { id: "visa-apply", text: "How to apply for a visa" },
        { id: "visa-requirements", text: "Visa requirements" },
        { id: "visa-duration", text: "Visa duration" },
        { id: "visa-cost", text: "Visa cost" },
      ]
    } else if (
      messageText.toLowerCase().includes("destinations") ||
      messageText.toLowerCase().includes("lalibela") ||
      messageText.toLowerCase().includes("gondar") ||
      messageText.toLowerCase().includes("axum") ||
      messageText.toLowerCase().includes("simien")
    ) {
      return [
        { id: "lalibela", text: "Explore Lalibela" },
        { id: "gondar", text: "Explore Gondar" },
        { id: "axum", text: "Explore Axum" },
        { id: "simien", text: "Explore Simien Mountains" },
      ]
    } else if (messageText.toLowerCase().includes("feedback")) {
      return [
        { id: "feedback-positive", text: "Share positive feedback" },
        { id: "feedback-issue", text: "Report an issue" },
        { id: "feedback-suggestion", text: "Suggest an improvement" },
      ]
    }
    return [
      { id: "destinations", text: "Popular destinations" },
      
      { id: "human", text: "Speak to a human" },
    ]
  }

  // Simulate word-by-word typing effect
  const simulateTyping = async (message: Message) => {
    const words = message.text.split(" ")
    let currentText = ""
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + " "
      setMessages((prev) => {
        const updated = prev.filter((msg) => msg.id !== message.id)
        return [...updated, { ...message, text: currentText.trim() }]
      })
      await new Promise((resolve) => setTimeout(resolve, 100)) // 100ms delay per word
    }
    setMessages((prev) => {
      const updated = prev.filter((msg) => msg.id !== message.id)
      return [...updated, message]
    })
  }

  // Check if user is near the bottom of the chat
  const isNearBottom = () => {
    if (!chatContainerRef.current) return true
    const container = chatContainerRef.current
    const threshold = 100 // Pixels from bottom to consider "near"
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  // Scroll to bottom only when appropriate
  const scrollToBottom = (force = false) => {
    if (!chatContainerRef.current || !messagesEndRef.current) return

    if (force || !userHasScrolled.current || isNearBottom()) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      setShowScrollButton(false)
    } else {
      setShowScrollButton(true)
    }
  }

  // Handle scroll event to detect if user is scrolling
  const handleScroll = () => {
    if (!chatContainerRef.current) return

    userHasScrolled.current = true

    if (isNearBottom()) {
      setShowScrollButton(false)
    } else {
      setShowScrollButton(true)
    }
  }

  // Force scroll to bottom when button is clicked
  const handleScrollToBottom = () => {
    scrollToBottom(true)
  }

  useEffect(() => {
    const initializeChat = async () => {
      const token = getAuthToken()
      if (!token) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "**Welcome to EthioTravel Assistant!**\n\nPlease log in to access personalized travel assistance.",
          sender: "bot",
          timestamp: new Date(),
        }
        await simulateTyping(welcomeMessage)
        setQuickReplies([
          { id: "login", text: "Log in" },
          { id: "signup", text: "Sign up" },
          { id: "browse", text: "Continue browsing" },
        ])
        return
      }

      const storedSessionId = localStorage.getItem("chatbot_session_id")
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storedSessionId || "")

      if (storedSessionId && isValidUUID) {
        setSessionId(storedSessionId)
        await fetchConversationHistory(storedSessionId)
      } else {
        const newSessionId = generateUUID()
        setSessionId(newSessionId)
        localStorage.setItem("chatbot_session_id", newSessionId)
        await sendMessage("Hello", false)
      }
    }

    initializeChat()
  }, [])

  // Attach scroll event listener
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Smart scroll behavior when messages change
  useEffect(() => {
    // Only auto-scroll if new messages were added
    if (messages.length > lastMessageCountRef.current) {
      // If the last message is from the user or bot, consider scrolling
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && (lastMessage.sender === "user" || lastMessage.sender === "bot")) {
        scrollToBottom(lastMessage.sender === "user") // Force scroll for user messages
      }
    }

    lastMessageCountRef.current = messages.length
  }, [messages])

  const fetchConversationHistory = async (sessionId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "**Authentication Required**\n\nPlease log in to continue.",
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

        // Reset user scroll state when loading history
        userHasScrolled.current = false
        setTimeout(() => scrollToBottom(true), 100)
      } else {
        const errorData = await response.json()
        console.error("Error fetching history:", errorData.error)
        if (response.status === 403 || response.status === 404) {
          localStorage.removeItem("chatbot_session_id")
          setSessionId(null)
          const newSessionId = generateUUID()
          setSessionId(newSessionId)
          localStorage.setItem("chatbot_session_id", newSessionId)
          await sendMessage("Hello", false)
        } else {
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: "**Failed to Load History**\n\nPlease try again later.",
            sender: "bot",
            timestamp: new Date(),
          }
          await simulateTyping(errorMessage)
        }
      }
    } catch (error) {
      console.error("Network error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "**Network Error**\n\nPlease check your connection and try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      await simulateTyping(errorMessage)
    }
  }

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

      // Reset user scroll state when sending a new message
      userHasScrolled.current = false
      scrollToBottom(true)
    }

    await new Promise((resolve) => setTimeout(resolve, 1500)) // 1.5s initial delay

    try {
      const token = getAuthToken()
      if (!token) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: "**Please Log In**\n\nLog in to continue using the chatbot.",
          sender: "bot",
          timestamp: new Date(),
        }
        await simulateTyping(errorMessage)
        setQuickReplies([
          { id: "login", text: "Log in" },
          { id: "signup", text: "Sign up" },
          { id: "browse", text: "Continue browsing" },
        ])
        setIsTyping(false)
        return
      }

      if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
        const newSessionId = generateUUID()
        setSessionId(newSessionId)
        localStorage.setItem("chatbot_session_id", newSessionId)
      }

      if (messageText.toLowerCase().includes("speak to a human")) {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: "**Human Support Request**\n\nI'm connecting you to our support team, available 9 AM–5 PM EAT. Please provide details for the agent (e.g., your query or contact info), or we'll follow up via email.",
          sender: "bot",
          timestamp: new Date(),
        }
        await simulateTyping(botMessage)
        setQuickReplies([
          { id: "details", text: "Provide details" },
          { id: "continue", text: "Continue with bot" },
          { id: "feedback", text: "Provide feedback" },
        ])
        setIsTyping(false)
        return
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
          text: data.response.content || "**Sorry**\n\nI didn't understand that. Please try again.",
          sender: "bot",
          timestamp: new Date(data.response.timestamp),
        }
        await simulateTyping(botMessage)
        if (
          data.session_id &&
          data.session_id !== sessionId &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.session_id)
        ) {
          setSessionId(data.session_id)
          localStorage.setItem("chatbot_session_id", data.session_id)
        }
        setQuickReplies(getContextualQuickReplies(messageText))
      } else {
        const errorText = await response.text()
        console.error("Error sending message:", errorText)
        let errorMessageText =
          "**Connection Issue**\n\nI'm having trouble connecting right now. Please try again later."
        if (errorText.includes("Must be a valid UUID")) {
          const newSessionId = generateUUID()
          setSessionId(newSessionId)
          localStorage.setItem("chatbot_session_id", newSessionId)
          setTimeout(() => sendMessage(messageText, false), 500)
          errorMessageText = "**Reconnecting**\n\nReconnecting to chat service..."
        } else if (errorText.includes("Rate limit exceeded")) {
          errorMessageText = "**High Demand**\n\nWe're experiencing high demand. Please try again in a moment."
        } else if (errorText.includes("Invalid request data")) {
          errorMessageText = "**Message Issue**\n\nThere was an issue with your message. Please try rephrasing."
        }
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: errorMessageText,
          sender: "system",
          timestamp: new Date(),
        }
        await simulateTyping(errorMessage)
        setQuickReplies(getContextualQuickReplies(messageText))
      }
    } catch (error) {
      console.error("Network error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "**Network Error**\n\nPlease check your connection and try again.",
        sender: "system",
        timestamp: new Date(),
      }
      await simulateTyping(errorMessage)
      setQuickReplies(getContextualQuickReplies(messageText))
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    sendMessage(inputValue)
  }

  const handleQuickReplyClick = (reply: QuickReply) => {
    if (reply.id === "login") {
      router.push("/login")
    } else if (reply.id === "signup") {
      router.push("/signup")
    } else if (reply.id === "browse") {
      router.push("/")
    } else if (reply.id === "continue") {
      const continueMessage: Message = {
        id: Date.now().toString(),
        text: "**Let's continue!**\n\nHow can I assist you with your Ethiopian adventure?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, continueMessage])
      setQuickReplies(getContextualQuickReplies(""))
    } else if (reply.id === "details") {
      const detailsMessage: Message = {
        id: Date.now().toString(),
        text: "**Support Details**\n\nPlease provide details for our support team (e.g., your query or contact info), and we'll follow up soon.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, detailsMessage])
      setQuickReplies([
        { id: "continue", text: "Continue with bot" },
        { id: "feedback", text: "Provide feedback" },
      ])
    } else {
      sendMessage(reply.text)
    }
  }

  const handleCloseChat = () => {
    router.back()
  }

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <header className=" text-white p-4 shadow-sm flex-shrink-0 sticky top-0 z-10">
        <div className="container bg-[#E91E63] mx-auto px-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={handleCloseChat} className="mr-2 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">EthioTravel AI Assistant</h1>
        </div>
      </header>

      {/* Chat container */}
      <div ref={chatContainerRef} className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === "user"
                  ? "justify-end"
                  : message.sender === "system"
                    ? "justify-center"
                    : "justify-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.sender === "system" ? (
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-sm shadow-sm">
                  <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }} />
                </div>
              ) : (
                <div
                  className={`rounded-lg px-4 py-2 max-w-[90%] ${
                    message.sender === "user"
                      ? "bg-[#E91E63] text-white shadow-md"
                      : "bg-white border border-gray-100 text-gray-800 shadow-sm"
                  }`}
                >
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }}
                  />
                  <p className="text-xs opacity-70 mt-1 text-right">
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
              <div className="rounded-lg px-4 py-2 bg-white border border-gray-100 shadow-sm">
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
                  className="bg-gradient-to-r from-pink-100 to-purple-100 border border-gray-200 rounded-full px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 transition-colors"
                  onClick={() => handleQuickReplyClick(reply)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {reply.text.toLowerCase().includes("visa") && <MapPin className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("weather") && <CloudSun className="inline h-3 w-3 mr-1" />}
                  {reply.text.toLowerCase().includes("tour") && <Calendar className="inline h-3 w-3 mr-1" />}
                  {(reply.text.toLowerCase().includes("cost") || reply.text.toLowerCase().includes("currency")) && (
                    <Clock className="inline h-3 w-3 mr-1" />
                  )}
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

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            className="fixed bottom-24 right-6 bg-[#E91E63] text-white rounded-full p-3 shadow-lg z-10"
            onClick={handleScrollToBottom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDown className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 py-4 flex-shrink-0 sticky bottom-0 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-l-full border-pink-300 focus:border-pink-500"
                disabled={isTyping}
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-r-full"
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
