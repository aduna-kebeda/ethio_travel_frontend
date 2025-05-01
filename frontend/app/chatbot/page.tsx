"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Send, ArrowLeft, MapPin, Calendar, Clock, CloudSun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

type QuickReply = {
  id: string
  text: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      const initialMessage: Message = {
        id: "1",
        text: "Hello! I'm your EthioTravel AI assistant. How can I help you plan your Ethiopian adventure today?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([initialMessage])

      // Set initial quick replies
      setQuickReplies([
        { id: "qr1", text: "Popular destinations" },
        { id: "qr2", text: "Best time to visit" },
        { id: "qr3", text: "Recommended tours" },
        { id: "qr4", text: "Travel costs" },
      ])
    }, 1000)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (inputValue.trim() === "") return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setQuickReplies([])
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      handleBotResponse(inputValue)
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReplyClick = (reply: QuickReply) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setQuickReplies([])
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      handleBotResponse(reply.text)
      setIsTyping(false)
    }, 1500)
  }

  const handleBotResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()
    let botResponse = ""
    let newQuickReplies: QuickReply[] = []

    if (lowerInput.includes("popular") && lowerInput.includes("destination")) {
      botResponse =
        "Ethiopia has many amazing destinations! Some of the most popular ones include Lalibela with its rock-hewn churches, the ancient city of Axum, the Simien Mountains, and the Danakil Depression. Would you like more information about any of these places?"
      newQuickReplies = [
        { id: "dest1", text: "Tell me about Lalibela" },
        { id: "dest2", text: "Tell me about Axum" },
        { id: "dest3", text: "Tell me about Simien Mountains" },
        { id: "dest4", text: "Tell me about Danakil Depression" },
      ]
    } else if (lowerInput.includes("best time") || lowerInput.includes("when to visit")) {
      botResponse =
        "The best time to visit Ethiopia is during the dry season from October to March. The weather is pleasant and ideal for trekking and sightseeing. Would you like to know about the weather in specific regions?"
      newQuickReplies = [
        { id: "weather1", text: "Weather in Addis Ababa" },
        { id: "weather2", text: "Weather in Lalibela" },
        { id: "weather3", text: "Weather in Danakil" },
      ]
    } else if (lowerInput.includes("tour") || lowerInput.includes("package")) {
      botResponse =
        "We have several popular tour packages! The Historical Northern Circuit is our most popular, visiting Lalibela, Axum, and Gondar. We also have cultural tours to the Omo Valley, trekking in the Simien Mountains, and adventure tours to the Danakil Depression. Which interests you most?"
      newQuickReplies = [
        { id: "tour1", text: "Historical Northern Circuit" },
        { id: "tour2", text: "Omo Valley Cultural Tour" },
        { id: "tour3", text: "Simien Mountains Trek" },
        { id: "tour4", text: "Danakil Depression Adventure" },
      ]
    } else if (lowerInput.includes("cost") || lowerInput.includes("price") || lowerInput.includes("budget")) {
      botResponse =
        "Travel costs in Ethiopia vary depending on your style of travel. Budget travelers can get by on $30-50 per day, mid-range travelers should budget $100-150 per day, and luxury travelers might spend $200+ per day. Would you like a cost breakdown for a specific type of trip?"
      newQuickReplies = [
        { id: "cost1", text: "Budget travel costs" },
        { id: "cost2", text: "Mid-range travel costs" },
        { id: "cost3", text: "Luxury travel costs" },
      ]
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      botResponse =
        "Hello there! I'm your EthioTravel AI assistant. How can I help you plan your Ethiopian adventure today?"
      newQuickReplies = [
        { id: "qr1", text: "Popular destinations" },
        { id: "qr2", text: "Best time to visit" },
        { id: "qr3", text: "Recommended tours" },
        { id: "qr4", text: "Travel costs" },
      ]
    } else if (lowerInput.includes("thank")) {
      botResponse =
        "You're welcome! I'm happy to help with your Ethiopian travel plans. Is there anything else you'd like to know?"
      newQuickReplies = [
        { id: "more1", text: "Yes, I have more questions" },
        { id: "more2", text: "No, that's all for now" },
      ]
    } else if (lowerInput.includes("human") || lowerInput.includes("agent") || lowerInput.includes("person")) {
      botResponse =
        "I'd be happy to connect you with a human travel agent. Please click the button below to request a call from one of our travel specialists."
      newQuickReplies = [
        { id: "human1", text: "Request a call" },
        { id: "human2", text: "Continue with AI assistant" },
      ]
    } else {
      botResponse =
        "I'm not sure I understand. Could you please rephrase your question or choose one of these popular topics?"
      newQuickReplies = [
        { id: "qr1", text: "Popular destinations" },
        { id: "qr2", text: "Best time to visit" },
        { id: "qr3", text: "Recommended tours" },
        { id: "qr4", text: "Travel costs" },
      ]
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setQuickReplies(newQuickReplies)
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
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                  {reply.id.startsWith("dest") && <MapPin className="inline h-3 w-3 mr-1" />}
                  {reply.id.startsWith("weather") && <CloudSun className="inline h-3 w-3 mr-1" />}
                  {reply.id.startsWith("tour") && <Calendar className="inline h-3 w-3 mr-1" />}
                  {reply.id.startsWith("cost") && <Clock className="inline h-3 w-3 mr-1" />}
                  {reply.id.startsWith("human") && <User className="inline h-3 w-3 mr-1" />}
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
              />
              <Button
                type="submit"
                className="bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-r-full"
                disabled={inputValue.trim() === ""}
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
