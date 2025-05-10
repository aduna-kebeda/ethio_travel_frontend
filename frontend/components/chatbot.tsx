"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Cloud,
  Calendar,
  User,
  MapPin,
  ThermometerSun,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ClientOnly } from "@/components/client-only"
import { useAuth } from "@/components/auth-provider"
import { detectIntent } from "@/lib/message-parser"

// Message types
type MessageType = "text" | "weather" | "alert" | "itinerary" | "loading" | "options"

interface Message {
  id: string
  content: string
  sender: "user" | "bot" | "system"
  timestamp: Date
  type: MessageType
  data?: any
}

interface QuickReply {
  id: string
  text: string
}

interface WeatherData {
  location: string
  temp: string
  condition: string
  humidity: string
  icon?: string
  forecast?: {
    day: string
    temp: string
    condition: string
  }[]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isHumanRequested, setIsHumanRequested] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [lastMessageType, setLastMessageType] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // API base URL
  const API_BASE_URL = "https://ai-driven-travel.onrender.com/api/chatbot"

  // Get auth context
  const { user, isAuthenticated, isLoading } = useAuth()

  // Debug authentication state
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, user, isLoading })
  }, [isAuthenticated, user, isLoading])

  // Get access token with fallback to environment variable and localStorage
  const getAuthToken = () => {
    // First try localStorage (more reliable in development)
    if (typeof window !== "undefined") {
      const localStorageToken = localStorage.getItem("access_token")
      if (localStorageToken) {
        console.log("Found token in localStorage")
        return localStorageToken
      }
    }

    // Then try cookies
    if (typeof document !== "undefined") {
      try {
        const cookies = document.cookie.split(";")
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="))
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1].trim()
          console.log("Found token in cookies")
          return token
        }
      } catch (error) {
        console.error("Error reading token from cookies:", error)
      }
    }

    // Fallback to environment variable
    if (process.env.NEXT_PUBLIC_JWT_TOKEN) {
      console.log("Using environment variable token")
      return process.env.NEXT_PUBLIC_JWT_TOKEN
    }

    console.log("No token found")
    return null
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Initialize chat when authentication state changes or component mounts
  useEffect(() => {
    // Don't initialize until auth state is loaded
    if (isLoading) {
      return
    }

    console.log("Initializing chat with auth state:", { isAuthenticated, user })
    setAuthChecked(true)

    // Load conversation history or start a new session
    const initializeChat = async () => {
      // Check if user is authenticated
      const token = getAuthToken()
      console.log("Token available:", !!token)

      if (!isAuthenticated || !token) {
        console.log("User not authenticated, showing login prompt")
        setMessages([
          {
            id: `welcome-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: "Welcome to EthioTravel Assistant! Please log in to access personalized travel assistance.",
            sender: "bot",
            timestamp: new Date(),
            type: "text",
          },
        ])

        // Add login options
        setTimeout(() => {
          addOptionsMessage([
            { id: "login", text: "Log in" },
            { id: "signup", text: "Sign up" },
            { id: "continue-browsing", text: "Continue browsing" },
          ])
        }, 500)

        return
      }

      console.log("User is authenticated, starting session")

      // User is authenticated, start a session
      setMessages([
        {
          id: `welcome-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: `Welcome back${user?.first_name ? `, ${user.first_name}` : ""}! How can I help you with your travel plans today?`,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ])

      // Don't add options message immediately after welcome
      // This prevents duplicate messages

      const storedSessionId = localStorage.getItem("chatbot_session_id")
      if (storedSessionId) {
        console.log("Found stored session ID:", storedSessionId)
        setSessionId(storedSessionId)
        await fetchConversationHistory(storedSessionId)
      } else {
        console.log("No stored session ID, starting new session")
        // Don't send an automatic "Hello" message
        // This prevents duplicate welcome messages
        setSessionId(`new-session-${Date.now()}`)
        localStorage.setItem("chatbot_session_id", `new-session-${Date.now()}`)
      }
    }

    initializeChat()
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  // Update the fetchConversationHistory function to use the correct authentication
  const fetchConversationHistory = async (sessionId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error("No authentication token found")
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: "Authentication required. Please log in to continue.",
            sender: "system",
            timestamp: new Date(),
            type: "text",
          },
        ])
        return
      }

      console.log("Fetching conversation history for session:", sessionId)

      const response = await fetch(`${API_BASE_URL}/message/history/?session_id=${sessionId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Received history data:", data)

        if (!data.messages) {
          throw new Error("Invalid history response: messages field missing")
        }

        const mappedMessages: Message[] = data.messages.map((msg: any) => ({
          id: `history-${msg.id || Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: msg.content || "No content",
          sender: msg.sender || "bot",
          timestamp: new Date(msg.created_at || Date.now()),
          type: msg.type || "text",
          data: msg.data || undefined,
        }))

        setMessages(mappedMessages)
      } else {
        const errorText = await response.text()
        console.error("Error fetching history:", errorText || response.statusText)

        if (response.status === 403 || response.status === 404) {
          console.log("Session not found or expired, starting new session")
          localStorage.removeItem("chatbot_session_id")
          setSessionId(null)
          // Don't send an automatic message
          setSessionId(`new-session-${Date.now()}`)
          localStorage.setItem("chatbot_session_id", `new-session-${Date.now()}`)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content: `Failed to load conversation history: ${errorText || "Unknown error"}`,
              sender: "system",
              timestamp: new Date(),
              type: "text",
            },
          ])
        }
      }
    } catch (error) {
      console.error("Network error fetching history:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: "Network error. Please check your connection and try again.",
          sender: "system",
          timestamp: new Date(),
          type: "text",
        },
      ])
    }
  }

  // Get weather data for a location
  const getWeatherData = async (location: string): Promise<WeatherData | null> => {
    try {
      // This would normally be an API call to a weather service
      // For now, we'll return mock data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for different locations
      const weatherData: Record<string, WeatherData> = {
        "addis ababa": {
          location: "Addis Ababa",
          temp: "22°C",
          condition: "Partly Cloudy",
          humidity: "45%",
          forecast: [
            { day: "Tomorrow", temp: "23°C", condition: "Sunny" },
            { day: "Wednesday", temp: "21°C", condition: "Scattered Showers" },
          ],
        },
        gondar: {
          location: "Gondar",
          temp: "25°C",
          condition: "Sunny",
          humidity: "30%",
          forecast: [
            { day: "Tomorrow", temp: "26°C", condition: "Clear" },
            { day: "Wednesday", temp: "24°C", condition: "Partly Cloudy" },
          ],
        },
        lalibela: {
          location: "Lalibela",
          temp: "20°C",
          condition: "Clear",
          humidity: "35%",
          forecast: [
            { day: "Tomorrow", temp: "22°C", condition: "Sunny" },
            { day: "Wednesday", temp: "21°C", condition: "Clear" },
          ],
        },
        axum: {
          location: "Axum",
          temp: "27°C",
          condition: "Hot",
          humidity: "25%",
          forecast: [
            { day: "Tomorrow", temp: "28°C", condition: "Hot" },
            { day: "Wednesday", temp: "26°C", condition: "Sunny" },
          ],
        },
        "bahir dar": {
          location: "Bahir Dar",
          temp: "24°C",
          condition: "Partly Cloudy",
          humidity: "50%",
          forecast: [
            { day: "Tomorrow", temp: "25°C", condition: "Sunny" },
            { day: "Wednesday", temp: "23°C", condition: "Light Rain" },
          ],
        },
        harar: {
          location: "Harar",
          temp: "23°C",
          condition: "Clear",
          humidity: "40%",
          forecast: [
            { day: "Tomorrow", temp: "24°C", condition: "Sunny" },
            { day: "Wednesday", temp: "22°C", condition: "Clear" },
          ],
        },
        default: {
          location: "Ethiopia",
          temp: "23°C",
          condition: "Varies by Region",
          humidity: "40%",
          forecast: [
            { day: "Tomorrow", temp: "24°C", condition: "Varies by Region" },
            { day: "Wednesday", temp: "22°C", condition: "Varies by Region" },
          ],
        },
      }

      const normalizedLocation = location.toLowerCase().trim()
      return weatherData[normalizedLocation] || weatherData.default
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return null
    }
  }

  // Handle weather check request
  const handleWeatherCheck = async (location = "Ethiopia") => {
    setIsTyping(true)

    // Add user message if this is a direct request
    if (!location || location === "Ethiopia") {
      addOptionsMessage([
        { id: "weather-addis", text: "Addis Ababa" },
        { id: "weather-gondar", text: "Gondar" },
        { id: "weather-lalibela", text: "Lalibela" },
        { id: "weather-bahir-dar", text: "Bahir Dar" },
      ])

      setMessages((prev) => [
        ...prev,
        {
          id: `weather-prompt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: "Which city's weather would you like to check?",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ])

      setIsTyping(false)
      return
    }

    const weatherData = await getWeatherData(location)

    if (weatherData) {
      setMessages((prev) => [
        ...prev,
        {
          id: `weather-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: `Weather in ${weatherData.location}`,
          sender: "bot",
          timestamp: new Date(),
          type: "weather",
          data: weatherData,
        },
      ])

      // Don't add options after weather response
      setLastMessageType("weather")
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `weather-error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: `I couldn't retrieve the weather for ${location}. Please try again later or check another location.`,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ])

      // Add weather location options
      addOptionsMessage([
        { id: "weather-addis", text: "Addis Ababa" },
        { id: "weather-gondar", text: "Gondar" },
        { id: "weather-lalibela", text: "Lalibela" },
        { id: "weather-bahir-dar", text: "Bahir Dar" },
      ])
    }

    setIsTyping(false)
  }

  // Update the sendMessage function to handle unauthenticated users
  const sendMessage = async (messageText: string, showInUI = true) => {
    if (messageText.trim() === "") return

    let userMessage: Message | null = null
    if (showInUI) {
      userMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: messageText,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, userMessage!])
      setMessage("")
      setIsTyping(true)
    }

    // Check for special commands
    const lowerMessage = messageText.toLowerCase().trim()

    // Handle weather check command
    if (lowerMessage.includes("weather") || lowerMessage.includes("check weather")) {
      // Extract location if provided
      let location = "Ethiopia"
      const locationMatch = lowerMessage.match(/weather (?:in|for|at) (.+)/i)
      if (locationMatch && locationMatch[1]) {
        location = locationMatch[1]
      }

      await handleWeatherCheck(location)
      return
    }

    try {
      // Check authentication again to ensure it's current
      const token = getAuthToken()
      if (!token) {
        console.error("No authentication token found when sending message")
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `auth-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content: "Authentication token not found. Please try logging in again.",
              sender: "bot",
              timestamp: new Date(),
              type: "text",
            },
          ])

          // Add login options
          addOptionsMessage([
            { id: "login", text: "Log in" },
            { id: "signup", text: "Sign up" },
            { id: "continue-browsing", text: "Continue browsing" },
          ])

          setIsTyping(false)
        }, 1000)
        return
      }

      console.log("Sending message:", messageText)
      console.log("Session ID:", sessionId)
      console.log("Using token:", token.substring(0, 10) + "...")

      const response = await fetch(`${API_BASE_URL}/message/message/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Received response:", data)

        if (!data.session_id || !data.response) {
          throw new Error("Invalid response: session_id or response missing")
        }

        const messageType = data.response.type || "text"
        const botMessage: Message = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: data.response.content || "Sorry, I didn't understand that. Please try again.",
          sender: "bot",
          timestamp: new Date(data.response.timestamp || Date.now()),
          type: messageType as MessageType,
          data: data.response.data || undefined,
        }

        setMessages((prev) => [...prev, botMessage])
        setSessionId(data.session_id)
        localStorage.setItem("chatbot_session_id", data.session_id)

        // Detect intent to determine if we should show quick replies
        const intent = detectIntent(messageText)
        setLastMessageType(intent)

        // Only add quick replies for certain intents
        const shouldAddQuickReplies = !["weather", "itinerary", "booking"].includes(intent)

        if (shouldAddQuickReplies) {
          // Add quick replies from API response or use contextual ones
          const newQuickReplies = data.response.suggestions
            ? data.response.suggestions.map((s: string, index: number) => ({
                id: `sugg${index + 1}`,
                text: s,
              }))
            : getContextualQuickReplies(intent, messageText)

          addOptionsMessage(newQuickReplies)
        }
      } else {
        const errorText = await response.text()
        console.error("Error sending message:", errorText || response.statusText)

        // Check if it's an authentication error
        if (response.status === 401 || response.status === 403) {
          console.log("Authentication error when sending message")
          setMessages((prev) => [
            ...prev,
            {
              id: `auth-error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content: "Your session has expired. Please log in again to continue.",
              sender: "system",
              timestamp: new Date(),
              type: "text",
            },
          ])

          // Add login options
          addOptionsMessage([
            { id: "login", text: "Log in" },
            { id: "signup", text: "Sign up" },
            { id: "continue-browsing", text: "Continue browsing" },
          ])
        } else {
          const errorMessage: Message = {
            id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: `Error: ${errorText || response.statusText || "Something went wrong. Please try again."}`,
            sender: "system",
            timestamp: new Date(),
            type: "text",
          }
          setMessages((prev) => [...prev, errorMessage])

          addOptionsMessage([
            { id: "faq-visa", text: "Visa requirements" },
            { id: "faq-currency", text: "Currency information" },
            { id: "faq-safety", text: "Safety tips" },
            { id: "weather-check", text: "Check weather" },
            { id: "human-agent", text: "Speak to a human" },
          ])
        }
      }
    } catch (error: any) {
      console.error("Network error sending message:", error.message)
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: `Network error: ${error.message || "Please check your connection and try again."}`,
        sender: "system",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
      addOptionsMessage([
        { id: "faq-visa", text: "Visa requirements" },
        { id: "faq-currency", text: "Currency information" },
        { id: "faq-safety", text: "Safety tips" },
        { id: "weather-check", text: "Check weather" },
        { id: "human-agent", text: "Speak to a human" },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Get contextual quick replies based on intent and message
  const getContextualQuickReplies = (intent: string, message: string): { id: string; text: string }[] => {
    const lowerMessage = message.toLowerCase()

    // For destination queries, offer related information
    if (lowerMessage.includes("gondar")) {
      return [
        { id: "gondar-attractions", text: "Attractions in Gondar" },
        { id: "gondar-hotels", text: "Hotels in Gondar" },
        { id: "gondar-restaurants", text: "Restaurants in Gondar" },
        { id: "weather-gondar", text: "Weather in Gondar" },
      ]
    }

    if (lowerMessage.includes("lalibela")) {
      return [
        { id: "lalibela-attractions", text: "Attractions in Lalibela" },
        { id: "lalibela-hotels", text: "Hotels in Lalibela" },
        { id: "lalibela-restaurants", text: "Restaurants in Lalibela" },
        { id: "weather-lalibela", text: "Weather in Lalibela" },
      ]
    }

    if (lowerMessage.includes("addis") || lowerMessage.includes("addis ababa")) {
      return [
        { id: "addis-attractions", text: "Attractions in Addis Ababa" },
        { id: "addis-hotels", text: "Hotels in Addis Ababa" },
        { id: "addis-restaurants", text: "Restaurants in Addis Ababa" },
        { id: "weather-addis", text: "Weather in Addis Ababa" },
      ]
    }

    // For visa queries
    if (intent === "visa" || lowerMessage.includes("visa")) {
      return [
        { id: "visa-requirements", text: "Visa requirements" },
        { id: "visa-application", text: "How to apply" },
        { id: "visa-cost", text: "Visa costs" },
        { id: "visa-duration", text: "Visa duration" },
      ]
    }

    // For safety queries
    if (intent === "safety" || lowerMessage.includes("safety") || lowerMessage.includes("safe")) {
      return [
        { id: "safety-general", text: "General safety tips" },
        { id: "safety-health", text: "Health precautions" },
        { id: "safety-areas", text: "Safe areas to visit" },
        { id: "safety-emergency", text: "Emergency contacts" },
      ]
    }

    // Default quick replies
    return [
      { id: "faq-visa", text: "Visa requirements" },
      { id: "faq-currency", text: "Currency information" },
      { id: "faq-safety", text: "Safety tips" },
      { id: "weather-check", text: "Check weather" },
      { id: "human-agent", text: "Speak to a human" },
    ]
  }

  const handleSendMessage = () => {
    sendMessage(message)
  }

  const handleQuickReplyClick = (replyId: string) => {
    const reply = messages
      .filter((m) => m.type === "options")
      .flatMap((m) => m.data?.options || [])
      .find((o) => o.id === replyId)

    // Handle authentication-related quick replies
    if (replyId === "login") {
      window.location.href = "/login"
      return
    } else if (replyId === "signup") {
      window.location.href = "/signup"
      return
    } else if (replyId === "continue-browsing") {
      toggleChat()
      return
    }

    // Handle weather-related quick replies
    if (replyId.startsWith("weather-")) {
      const location = replyId.replace("weather-", "")
      if (location === "check") {
        handleWeatherCheck()
      } else {
        handleWeatherCheck(location)
      }
      return
    }

    if (reply) {
      sendMessage(reply.text)
    } else {
      // Handle bottom quick replies
      const quickReplyMap: Record<string, string> = {
        "faq-visa": "Visa requirements",
        "faq-currency": "Currency information",
        "faq-safety": "Safety tips",
        "weather-check": "Check weather",
        "human-agent": "Speak to a human",
        "itinerary-view": "View my itinerary",
      }
      const replyText = quickReplyMap[replyId]
      if (replyText) {
        sendMessage(replyText)
      }
    }
  }

  const handleHumanRequest = () => {
    setIsHumanRequested(true)
    const systemMessage: Message = {
      id: `system-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: "Connecting you to a human agent. Please wait a moment...",
      sender: "system",
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, systemMessage])

    // TODO: Integrate with backend endpoint for human agent handoff (e.g., POST /api/chatbot/request-human/)
    setTimeout(() => {
      const humanMessage: Message = {
        id: `human-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: "Hi there! I'm Abebe from the EthioTravel support team. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, humanMessage])
      addOptionsMessage([
        { id: "faq-visa", text: "Visa requirements" },
        { id: "faq-currency", text: "Currency information" },
        { id: "faq-safety", text: "Safety tips" },
        { id: "weather-check", text: "Check weather" },
      ])
    }, 3000)
  }

  const addOptionsMessage = (options: { id: string; text: string }[]) => {
    const optionsMessage: Message = {
      id: `options-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: "Options",
      sender: "bot",
      timestamp: new Date(),
      type: "options",
      data: { options },
    }
    setMessages((prev) => [...prev, optionsMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isTyping) {
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "text":
        return <p className="whitespace-pre-wrap">{message.content}</p>

      case "weather":
        return (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="font-bold flex items-center text-blue-700">
              <MapPin className="h-4 w-4 mr-1" /> {message.data?.location || "Unknown Location"}
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="text-center flex flex-col items-center">
                <ThermometerSun className="h-8 w-8 text-amber-500 mb-1" />
                <div className="text-xs text-gray-500">Temperature</div>
                <div className="font-bold text-blue-800">{message.data?.temp || "N/A"}</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <Cloud className="h-8 w-8 text-blue-500 mb-1" />
                <div className="text-xs text-gray-500">Condition</div>
                <div className="font-bold text-blue-800">{message.data?.condition || "N/A"}</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="h-8 w-8 flex items-center justify-center text-blue-400 mb-1">💧</div>
                <div className="text-xs text-gray-500">Humidity</div>
                <div className="font-bold text-blue-800">{message.data?.humidity || "N/A"}</div>
              </div>
            </div>

            {message.data?.forecast && (
              <div className="mt-3 pt-2 border-t border-blue-100">
                <div className="text-xs font-medium text-blue-700 mb-1">Forecast</div>
                <div className="grid grid-cols-2 gap-2">
                  {message.data.forecast.map((day: any, index: number) => (
                    <div key={index} className="bg-white rounded p-1 text-xs">
                      <div className="font-medium">{day.day}</div>
                      <div className="flex justify-between items-center">
                        <span>{day.temp}</span>
                        <span className="text-gray-600">{day.condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case "itinerary":
        return (
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="font-bold flex items-center text-green-700">
              <Calendar className="h-4 w-4 mr-1" /> Your Itinerary
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.data?.startDate || "N/A"} to {message.data?.endDate || "N/A"}
            </div>
            <div className="mt-2 space-y-2">
              {(message.data?.destinations || []).map((dest: any, index: number) => (
                <div key={index} className="flex justify-between items-center border-b border-green-100 pb-1">
                  <div>
                    <div className="font-medium text-green-800">{dest.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{dest.hotel || "N/A"}</div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {dest.days || 0} {dest.days === 1 ? "day" : "days"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="text-xs bg-white text-green-700 border-green-200">
                Modify Itinerary
              </Button>
            </div>
          </div>
        )

      case "options":
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(message.data?.options || []).map((option: { id: string; text: string }) => (
              <button
                key={option.id}
                onClick={() => handleQuickReplyClick(option.id)}
                className="bg-white hover:bg-gray-100 text-gray-800 text-xs py-2 px-3 rounded-md shadow-sm border border-gray-200 transition-colors text-left"
              >
                {option.text}
              </button>
            ))}
          </div>
        )

      default:
        return <p>{message.content}</p>
    }
  }

  // Show debug info for authentication state
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== "development") return null

    return (
      <div className="absolute bottom-0 left-0 bg-black/80 text-white text-xs p-1 rounded-tr-md">
        Auth: {isAuthenticated ? "✅" : "❌"} | Token: {getAuthToken() ? "✅" : "❌"} | User: {user?.username || "none"}
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div
            className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
              isMinimized ? "w-72 h-16" : "w-80 sm:w-96 h-[calc(100vh-120px)] max-h-[600px]"
            }`}
            style={{ maxHeight: isMinimized ? "64px" : "calc(100vh - 120px)" }}
          >
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <h3 className="font-bold">Travel Assistant</h3>
                {isHumanRequested && (
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    Human Support
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleMinimize}
                  className="text-white hover:text-gray-200 bg-white/10 rounded-full p-1"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button onClick={toggleChat} className="text-white hover:text-gray-200 bg-white/10 rounded-full p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="p-4 overflow-y-auto bg-gray-50" style={{ height: "calc(100% - 140px)" }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 ${
                        msg.sender === "user" ? "text-right" : msg.sender === "system" ? "text-center" : "text-left"
                      }`}
                    >
                      {msg.sender === "system" ? (
                        <div className="inline-block bg-white rounded-lg px-4 py-2 max-w-[80%] text-gray-500 text-xs shadow-sm">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 max-w-[80%] mx-0 mb-1 w-full">
                          {msg.sender === "bot" && (
                            <Avatar className="h-8 w-8 bg-primary text-white shadow-sm">
                              {isHumanRequested ? <User className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 shadow-sm ${
                              msg.sender === "user" ? "bg-primary text-white ml-auto" : "bg-white text-gray-800"
                            }`}
                          >
                            {renderMessageContent(msg)}
                            <p className="text-xs mt-1 opacity-70 text-right">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {msg.sender === "user" && (
                            <Avatar className="h-8 w-8 bg-gray-300 shadow-sm">
                              <User className="h-4 w-4" />
                            </Avatar>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center space-x-2 text-left">
                      <Avatar className="h-8 w-8 bg-primary text-white shadow-sm">
                        {isHumanRequested ? <User className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                      </Avatar>
                      <div className="bg-white text-gray-800 rounded-lg px-4 py-2 shadow-sm">
                        <div className="flex space-x-1">
                          <div
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "600ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4 bg-white">
                  <div className="flex items-center">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-grow shadow-sm"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="ml-2"
                      size="icon"
                      disabled={message.trim() === "" || isTyping}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {!isHumanRequested && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => handleQuickReplyClick("faq-visa")}
                      >
                        <span className="truncate">Visa Requirements</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => handleQuickReplyClick("weather-check")}
                      >
                        <span className="truncate">Check Weather</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => handleQuickReplyClick("itinerary-view")}
                      >
                        <span className="truncate">View Itinerary</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start text-red-500"
                        onClick={() => handleQuickReplyClick("human-agent")}
                      >
                        <span className="truncate">Human Support</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Debug info */}
                {renderDebugInfo()}
              </>
            )}
          </div>
        )}

        {!isOpen && (
          <Button
            onClick={toggleChat}
            className="rounded-full h-16 w-16 shadow-xl flex items-center justify-center bg-primary hover:bg-primary/90 animate-pulse"
            size="icon"
          >
            <MessageSquare className="h-7 w-7" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full"></span>
          </Button>
        )}
      </div>
    </ClientOnly>
  )
}
