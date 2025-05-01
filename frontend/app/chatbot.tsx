"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X, Minimize2, Maximize2, Cloud, Calendar, User } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isHumanRequested, setIsHumanRequested] = useState(false)

  // Initial messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your EthioTravel AI assistant. How can I help with your Ethiopian adventure today?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
    {
      id: "options",
      content: "Quick options",
      sender: "bot",
      timestamp: new Date(),
      type: "options",
      data: {
        options: [
          { id: "itinerary", text: "Adjust my itinerary" },
          { id: "weather", text: "Weather updates" },
          { id: "faq", text: "Common questions" },
          { id: "emergency", text: "Emergency assistance" },
        ],
      },
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  // FAQ responses
  const faqResponses: Record<string, string> = {
    visa: "Most visitors to Ethiopia need a visa. You can apply for an e-visa online at https://www.evisa.gov.et/ or get a visa on arrival at Bole International Airport in Addis Ababa. The standard tourist visa is valid for 30 days and costs approximately $50 USD.",
    currency:
      "The currency of Ethiopia is the Ethiopian Birr (ETB). ATMs are available in major cities, but it's advisable to carry cash when traveling to rural areas. Major hotels and some restaurants in Addis Ababa accept credit cards.",
    language:
      "Amharic is the official language of Ethiopia. English is widely spoken in tourist areas, hotels, and by guides. Learning a few basic Amharic phrases is appreciated by locals.",
    safety:
      "Ethiopia is generally safe for tourists, but like any destination, it's important to take standard precautions. Stay informed about current conditions, avoid isolated areas at night, and keep valuables secure. Our app provides real-time safety alerts for all regions.",
    weather:
      "Ethiopia's climate varies by altitude. The highlands are temperate with minimal seasonal temperature variation. The best time to visit is during the dry season (October to May). The lowlands can be significantly hotter.",
    food: "Ethiopian cuisine is unique and flavorful. Try injera (sourdough flatbread) with various wats (stews). Vegetarians will find plenty of options as many Ethiopians observe fasting periods with meat-free dishes.",
    transport:
      "Within cities, taxis and bajaj (auto-rickshaws) are common. For intercity travel, domestic flights are recommended for longer distances. Buses connect major towns but can be crowded and slow.",
    internet:
      "Wi-Fi is available in most hotels and many cafes in Addis Ababa and other major cities. Mobile data is affordable - you can purchase a local SIM card with data packages at the airport or in mobile shops.",
  }

  // Weather data (simulated)
  const weatherData = {
    "Addis Ababa": { temp: "22°C", condition: "Sunny", humidity: "45%" },
    Lalibela: { temp: "24°C", condition: "Clear", humidity: "30%" },
    Gondar: { temp: "26°C", condition: "Partly cloudy", humidity: "40%" },
    Axum: { temp: "28°C", condition: "Sunny", humidity: "25%" },
    Harar: { temp: "25°C", condition: "Clear", humidity: "35%" },
    "Bahir Dar": { temp: "27°C", condition: "Partly cloudy", humidity: "50%" },
    "Danakil Depression": { temp: "38°C", condition: "Hot", humidity: "15%" },
    "Simien Mountains": { temp: "15°C", condition: "Cloudy", humidity: "60%" },
  }

  // Quick replies based on context
  const getQuickReplies = (): QuickReply[] => {
    return [
      { id: "faq-visa", text: "Visa requirements" },
      { id: "faq-currency", text: "Currency information" },
      { id: "faq-safety", text: "Safety tips" },
      { id: "weather-check", text: "Check weather" },
      { id: "human-agent", text: "Speak to a human" },
    ]
  }

  const handleSendMessage = () => {
    if (message.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      handleBotResponse(message)
      setIsTyping(false)
    }, 1000)
  }

  const handleBotResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()

    // Check for FAQ keywords
    for (const [keyword, response] of Object.entries(faqResponses)) {
      if (lowerCaseMessage.includes(keyword)) {
        addBotMessage(response)
        return
      }
    }

    // Check for weather requests
    if (
      lowerCaseMessage.includes("weather") ||
      lowerCaseMessage.includes("temperature") ||
      lowerCaseMessage.includes("forecast")
    ) {
      const locations = Object.keys(weatherData)
      let foundLocation = null

      for (const location of locations) {
        if (lowerCaseMessage.includes(location.toLowerCase())) {
          foundLocation = location
          break
        }
      }

      if (foundLocation) {
        addWeatherUpdate(foundLocation)
      } else {
        addBotMessage("Which location would you like to check the weather for?")
        addOptionsMessage([...locations.slice(0, 4).map((loc) => ({ id: `weather-${loc}`, text: loc }))])
      }
      return
    }

    // Check for itinerary adjustments
    if (
      lowerCaseMessage.includes("itinerary") ||
      lowerCaseMessage.includes("schedule") ||
      lowerCaseMessage.includes("plan") ||
      lowerCaseMessage.includes("booking")
    ) {
      addBotMessage("I'd be happy to help with your itinerary. What would you like to adjust?")
      addOptionsMessage([
        { id: "itinerary-date", text: "Change dates" },
        { id: "itinerary-add", text: "Add destination" },
        { id: "itinerary-remove", text: "Remove destination" },
        { id: "itinerary-view", text: "View my itinerary" },
      ])
      return
    }

    // Check for emergency assistance
    if (
      lowerCaseMessage.includes("emergency") ||
      lowerCaseMessage.includes("help") ||
      lowerCaseMessage.includes("urgent") ||
      lowerCaseMessage.includes("danger")
    ) {
      addBotMessage(
        "For emergencies, please contact our 24/7 support line at +251-911-123-456 or use the emergency button in the app. Would you like me to connect you with a human agent immediately?",
      )
      addOptionsMessage([
        { id: "emergency-yes", text: "Yes, connect me" },
        { id: "emergency-no", text: "No, just information" },
      ])
      return
    }

    // Check for human agent requests
    if (
      lowerCaseMessage.includes("human") ||
      lowerCaseMessage.includes("agent") ||
      lowerCaseMessage.includes("person") ||
      lowerCaseMessage.includes("representative")
    ) {
      handleHumanRequest()
      return
    }

    // Default responses
    const defaultResponses = [
      "I can help you with information about destinations in Ethiopia, weather updates, itinerary adjustments, and emergency assistance. What would you like to know?",
      "Ethiopia has so much to offer! From the rock-hewn churches of Lalibela to the stunning landscapes of the Simien Mountains. How can I assist with your travel plans?",
      "I'm here to make your Ethiopian adventure seamless. Would you like information about specific destinations, cultural tips, or travel logistics?",
      "I can provide real-time updates on travel conditions, weather forecasts, and local events. What information would be most helpful for your trip?",
    ]

    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    addBotMessage(randomResponse)

    // Add quick reply options after default response
    setTimeout(() => {
      addOptionsMessage(getQuickReplies().map((reply) => ({ id: reply.id, text: reply.text })))
    }, 500)
  }

  const handleQuickReplyClick = (replyId: string) => {
    // Handle different quick replies
    if (replyId.startsWith("faq-")) {
      const topic = replyId.replace("faq-", "")
      const response = faqResponses[topic]

      // Add user message showing what they clicked
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `${topic.charAt(0).toUpperCase() + topic.slice(1)} information`,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        if (response) {
          addBotMessage(response)
        } else {
          addBotMessage(`I don't have specific information about ${topic} yet, but I'm learning more every day!`)
        }
      }, 500)
    } else if (replyId.startsWith("weather-")) {
      const location = replyId.replace("weather-", "")

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `Weather in ${location}`,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        addWeatherUpdate(location)
      }, 500)
    } else if (replyId === "weather-check") {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: "I'd like to check the weather",
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        addBotMessage("Which location would you like to check the weather for?")
        addOptionsMessage(Object.keys(weatherData).map((loc) => ({ id: `weather-${loc}`, text: loc })))
      }, 500)
    } else if (replyId.startsWith("itinerary-")) {
      const action = replyId.replace("itinerary-", "")

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `I want to ${action} my itinerary`,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, userMessage])

      // Handle different itinerary actions
      setTimeout(() => {
        if (action === "view") {
          addItineraryMessage()
        } else {
          addBotMessage(`To ${action} your itinerary, please provide more details about what you'd like to change.`)
        }
      }, 500)
    } else if (replyId === "human-agent") {
      handleHumanRequest()
    } else if (replyId.startsWith("emergency-")) {
      const choice = replyId.replace("emergency-", "")

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: choice === "yes" ? "Yes, connect me with someone" : "No, just information please",
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        if (choice === "yes") {
          handleHumanRequest()
        } else {
          addBotMessage(
            "For emergency information: Our 24/7 emergency hotline is +251-911-123-456. In case of medical emergencies, the main hospitals in Addis Ababa are St. Paul's Hospital (+251-111-234-567) and Tikur Anbessa Hospital (+251-111-239-752). Embassy contacts are available in the 'Emergency Contacts' section of the app.",
          )
        }
      }, 500)
    }
  }

  const handleHumanRequest = () => {
    setIsHumanRequested(true)

    // Add system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: "Connecting you to a human agent. Please wait a moment...",
      sender: "system",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, systemMessage])

    // Simulate waiting for human agent
    setTimeout(() => {
      const humanMessage: Message = {
        id: Date.now().toString(),
        content: "Hi there! I'm Abebe from the EthioTravel support team. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, humanMessage])
    }, 3000)
  }

  const addBotMessage = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      content: content,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, botMessage])
  }

  const addWeatherUpdate = (location: string) => {
    if (weatherData[location as keyof typeof weatherData]) {
      const data = weatherData[location as keyof typeof weatherData]

      const weatherMessage: Message = {
        id: Date.now().toString(),
        content: `Weather in ${location}`,
        sender: "bot",
        timestamp: new Date(),
        type: "weather",
        data: {
          location,
          ...data,
        },
      }

      setMessages((prev) => [...prev, weatherMessage])
    } else {
      addBotMessage(`I'm sorry, I don't have weather information for ${location} at the moment.`)
    }
  }

  const addItineraryMessage = () => {
    // Simulated itinerary data
    const itineraryMessage: Message = {
      id: Date.now().toString(),
      content: "Your current itinerary",
      sender: "bot",
      timestamp: new Date(),
      type: "itinerary",
      data: {
        startDate: "2025-05-15",
        endDate: "2025-05-22",
        destinations: [
          { name: "Addis Ababa", days: 2, hotel: "Sheraton Addis" },
          { name: "Lalibela", days: 2, hotel: "Mountain View Hotel" },
          { name: "Gondar", days: 1, hotel: "Goha Hotel" },
          { name: "Bahir Dar", days: 2, hotel: "Kuriftu Resort" },
        ],
      },
    }

    setMessages((prev) => [...prev, itineraryMessage])
  }

  const addOptionsMessage = (options: { id: string; text: string }[]) => {
    const optionsMessage: Message = {
      id: Date.now().toString(),
      content: "Options",
      sender: "bot",
      timestamp: new Date(),
      type: "options",
      data: {
        options,
      },
    }

    setMessages((prev) => [...prev, optionsMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
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
              <Cloud className="h-4 w-4 mr-1" /> {message.data.location}
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="text-center flex flex-col items-center">
                <div className="text-xs text-gray-500">Temperature</div>
                <div className="font-bold text-blue-800">{message.data.temp}</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-xs text-gray-500">Condition</div>
                <div className="font-bold text-blue-800">{message.data.condition}</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-xs text-gray-500">Humidity</div>
                <div className="font-bold text-blue-800">{message.data.humidity}</div>
              </div>
            </div>
          </div>
        )

      case "itinerary":
        return (
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="font-bold flex items-center text-green-700">
              <Calendar className="h-4 w-4 mr-1" /> Your Itinerary
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.data.startDate} to {message.data.endDate}
            </div>
            <div className="mt-2 space-y-2">
              {message.data.destinations.map((dest: any, index: number) => (
                <div key={index} className="flex justify-between items-center border-b border-green-100 pb-1">
                  <div>
                    <div className="font-medium text-green-800">{dest.name}</div>
                    <div className="text-xs text-gray-500">{dest.hotel}</div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {dest.days} {dest.days === 1 ? "day" : "days"}
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
            {message.data.options.map((option: { id: string; text: string }) => (
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

  return (
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
              <button onClick={toggleMinimize} className="text-white hover:text-gray-200 bg-white/10 rounded-full p-1">
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
                  />
                  <Button onClick={handleSendMessage} className="ml-2" size="icon" disabled={message.trim() === ""}>
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
  )
}
