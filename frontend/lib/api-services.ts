// // API service for chatbot functionality

// /**
//  * Base API URL for the chatbot service
//  */
// const API_BASE_URL = "https://ai-driven-travel.onrender.com/api"

// /**
//  * Interface for a chatbot message
//  */
// export interface ChatMessage {
//   id?: number
//   content: string
//   sender: "user" | "bot" | "system"
//   created_at?: string
//   timestamp?: Date
// }

// /**
//  * Interface for a chatbot conversation
//  */
// export interface ChatConversation {
//   id?: number
//   session_id: string
//   created_at?: string
//   updated_at?: string
//   messages: ChatMessage[]
// }

// /**
//  * Interface for a chatbot response
//  */
// export interface ChatResponse {
//   session_id: string
//   response: {
//     content: string
//     timestamp: string
//   }
// }

// // Generate a truly unique ID for messages
// export const generateUniqueId = (): string => {
//   return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
// }

// /**
//  * Get the authentication token from localStorage
//  * @returns The authentication token or null if not found
//  */
// const getAuthToken = (): string => {
//   // This is a fixed token for the chatbot API
//   // In a production environment, you would get this from a secure source
//   return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyMDM0NTI4LCJpYXQiOjE3NDY4NTA1MjgsImp0aSI6ImYxNDVkZWM3NDNjYjQzMDNhN2EyMDEyNDJjMzY3ZDk4IiwidXNlcl9pZCI6IjYxM2M4NWU5LTRlYzctNDYxMC1iYjEwLTZkZTY1ZWI4Zjk2ZSJ9.9NZgcQ8nJ4tgUKB8k_DEbmGXamaBjQyl-s2h3VVLMHg"
// }

// /**
//  * Get the headers for API requests
//  * @returns The headers object with authentication token
//  */
// const getHeaders = (): HeadersInit => {
//   return {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: `Bearer ${getAuthToken()}`,
//   }
// }

// /**
//  * Check if a session ID exists in localStorage
//  * If not, create a new one
//  */
// export const getOrCreateSessionId = (): string => {
//   if (typeof window !== "undefined") {
//     let sessionId = localStorage.getItem("chatSessionId")
//     if (!sessionId) {
//       // Generate a new UUID-like session ID
//       sessionId = crypto.randomUUID
//         ? crypto.randomUUID()
//         : `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
//       localStorage.setItem("chatSessionId", sessionId)
//     }
//     return sessionId
//   }
//   return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
// }

// /**
//  * Get the conversation history for a specific session
//  * @param sessionId The session ID to get history for
//  * @returns The conversation history
//  */
// export const getChatHistory = async (sessionId: string): Promise<ChatConversation> => {
//   try {
//     console.log(`Fetching chat history for session: ${sessionId}`)
//     const response = await fetch(`${API_BASE_URL}/chatbot/message/history/?session_id=${sessionId}`, {
//       method: "GET",
//       headers: getHeaders(),
//     })

//     if (!response.ok) {
//       let errorMessage = `Failed to fetch chat history: ${response.status} ${response.statusText}`
//       try {
//         const errorData = await response.json()
//         errorMessage = errorData.error || errorMessage
//       } catch (parseError) {
//         // If we can't parse the error, use the default message
//       }
//       console.error(errorMessage)

//       // If the conversation is not found, we should use the fallback
//       // and not try to use this session ID again
//       if (errorMessage.includes("Conversation not found") || response.status === 404) {
//         localStorage.removeItem("chatSessionId")
//         throw new Error("SESSION_NOT_FOUND")
//       }

//       throw new Error(errorMessage)
//     }

//     const data = await response.json()
//     console.log("Chat history retrieved successfully:", data)
//     return data
//   } catch (error) {
//     console.error("Error fetching chat history:", error)
//     // If the main API fails, use the fallback
//     return getFallbackChatHistory(sessionId)
//   }
// }

// /**
//  * Send a message to the chatbot
//  * @param message The message to send
//  * @param sessionId Optional session ID to continue a conversation
//  * @returns The chatbot response
//  */
// export const sendChatMessage = async (message: string, sessionId?: string): Promise<ChatResponse> => {
//   try {
//     console.log("Sending message to API:", message, "Session ID:", sessionId)

//     const payload = {
//       message,
//       ...(sessionId && { session_id: sessionId }),
//     }

//     console.log("API Endpoint:", `${API_BASE_URL}/chatbot/message/message/`)
//     console.log("Payload:", JSON.stringify(payload))

//     const response = await fetch(`${API_BASE_URL}/chatbot/message/message/`, {
//       method: "POST",
//       headers: getHeaders(),
//       body: JSON.stringify(payload),
//     })

//     if (!response.ok) {
//       let errorMessage = `Failed to send message: ${response.status} ${response.statusText}`
//       try {
//         const errorData = await response.json()
//         errorMessage = errorData.error || errorMessage
//       } catch (parseError) {
//         // If we can't parse the error, use the default message
//       }
//       console.error(errorMessage)
//       throw new Error(errorMessage)
//     }

//     const data = await response.json()
//     console.log("Message sent successfully, response:", data)

//     // Save the new session ID if one was returned
//     if (data.session_id && typeof window !== "undefined") {
//       localStorage.setItem("chatSessionId", data.session_id)
//     }

//     return data
//   } catch (error) {
//     console.error("Error sending chat message:", error)
//     // If the main API fails, use the fallback
//     return sendChatMessageFallback(message, sessionId)
//   }
// }

// /**
//  * Fallback function to get chat history when the main API is unavailable
//  * @param sessionId The session ID to get history for
//  * @returns A simulated chat history
//  */
// export const getFallbackChatHistory = async (sessionId: string): Promise<ChatConversation> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500))

//   // For the fallback, we'll just return a simple conversation
//   return {
//     id: 1,
//     session_id: sessionId,
//     created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//     updated_at: new Date().toISOString(),
//     messages: [
//       {
//         id: 1,
//         content: "Hello! I'm your EthioTravel AI assistant. How can I help with your Ethiopian adventure today?",
//         sender: "bot",
//         created_at: new Date(Date.now() - 3600000).toISOString(),
//       },
//       {
//         id: 2,
//         content: "I'm interested in visiting Ethiopia. What are the must-see places?",
//         sender: "user",
//         created_at: new Date(Date.now() - 3500000).toISOString(),
//       },
//       {
//         id: 3,
//         content:
//           "Ethiopia has many amazing destinations! Some must-see places include the rock-hewn churches of Lalibela, the ancient obelisks of Axum, the Simien Mountains National Park, and the otherworldly Danakil Depression. Would you like more information about any of these places?",
//         sender: "bot",
//         created_at: new Date(Date.now() - 3400000).toISOString(),
//       },
//     ],
//   }
// }

// // Fallback API for development/testing when the main API is unavailable
// export const sendChatMessageFallback = async (message: string, sessionId?: string): Promise<ChatResponse> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // Generate a session ID if none provided
//   const newSessionId = sessionId || getOrCreateSessionId()

//   // Simple response generation based on message content
//   let responseContent = "I'm sorry, I don't have enough information to answer that question."

//   if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
//     responseContent = "Hello! How can I help you with your travel plans to Ethiopia?"
//   } else if (message.toLowerCase().includes("weather")) {
//     responseContent =
//       "The weather in Ethiopia varies by region. Addis Ababa has a mild climate year-round, while the lowlands can be quite hot. The best time to visit is during the dry season from October to May."
//   } else if (message.toLowerCase().includes("visa")) {
//     responseContent =
//       "Most visitors to Ethiopia need a visa. You can apply for an e-visa online before your trip or get a visa on arrival at Bole International Airport in Addis Ababa."
//   } else if (
//     message.toLowerCase().includes("destination") ||
//     message.toLowerCase().includes("place") ||
//     message.toLowerCase().includes("visit")
//   ) {
//     responseContent =
//       "Ethiopia has many amazing destinations including the rock-hewn churches of Lalibela, the ancient obelisks of Axum, the Simien Mountains, and the Danakil Depression. What type of experience are you looking for?"
//   } else if (message.toLowerCase().includes("food") || message.toLowerCase().includes("eat")) {
//     responseContent =
//       "Ethiopian cuisine is delicious and unique! You must try injera (sourdough flatbread) with various stews like doro wat (spicy chicken). Don't miss participating in a traditional coffee ceremony!"
//   } else if (
//     message.toLowerCase().includes("cost") ||
//     message.toLowerCase().includes("price") ||
//     message.toLowerCase().includes("budget")
//   ) {
//     responseContent =
//       "Ethiopia can be quite affordable for travelers. Budget travelers can get by on $30-50 per day, mid-range on $50-100, and luxury travelers should expect to spend $100+ per day."
//   } else if (message.toLowerCase().includes("currency")) {
//     responseContent =
//       "The currency of Ethiopia is the Ethiopian Birr (ETB). ATMs are available in major cities, and credit cards are accepted at high-end hotels and restaurants, but it's good to carry cash for most transactions."
//   } else if (message.toLowerCase().includes("safety")) {
//     responseContent =
//       "Ethiopia is generally safe for travelers, but like any destination, it's important to take normal precautions. Stay aware of your surroundings, avoid displaying valuables, and follow local advice about areas to avoid."
//   } else if (message.toLowerCase().includes("language")) {
//     responseContent =
//       "Amharic is the official language of Ethiopia, but English is widely spoken in tourist areas, hotels, and by guides. Learning a few basic Amharic phrases can enhance your experience and is appreciated by locals."
//   } else if (message.toLowerCase().includes("transport") || message.toLowerCase().includes("getting around")) {
//     responseContent =
//       "Transportation options in Ethiopia include domestic flights (recommended for long distances), private car hire with driver, public buses, and minibuses. The road quality varies, so plan accordingly for longer travel times than expected."
//   } else if (message.toLowerCase().includes("gondar")) {
//     responseContent =
//       "Gondar, often called the 'Camelot of Africa', is a historic city in northern Ethiopia. It served as the capital of Ethiopia from the 17th to mid-19th centuries. The city is famous for its medieval castles and churches, particularly the Royal Enclosure (Fasil Ghebbi), a UNESCO World Heritage site. The complex contains several castles built by various emperors during the 17th and 18th centuries. Gondar is also known for Debre Berhan Selassie Church with its stunning ceiling painted with angels' faces, and the Fasilides Bath, which is filled with water once a year for the Timkat (Epiphany) celebrations. The city's elevation at about 2,200 meters gives it a pleasant climate year-round."
//   }

//   return {
//     session_id: newSessionId,
//     response: {
//       content: responseContent,
//       timestamp: new Date().toISOString(),
//     },
//   }
// }
