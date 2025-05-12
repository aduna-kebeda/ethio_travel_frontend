import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for chat sessions
// In a production app, you would use a database
const chatSessions: Record<string, { messages: string[] }> = {}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    // Validate inputs
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 })
    }

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }

    // Initialize session if it doesn't exist
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = { messages: [] }
    }

    // Store user message
    chatSessions[sessionId].messages.push(message)

    // Process the message and generate a response
    const botResponse = generateResponse(message, sessionId)

    // Store bot response
    chatSessions[sessionId].messages.push(botResponse)

    // Return the response
    return NextResponse.json({
      message: botResponse,
      sessionId: sessionId,
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

// Generate a response based on the user's message
function generateResponse(message: string, sessionId: string): string {
  const lowerMessage = message.toLowerCase()

  // Check for greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! How can I help with your travel plans today?"
  }

  // Check for destination inquiries
  if (lowerMessage.includes("where is")) {
    if (lowerMessage.includes("gondar")) {
      return "Gondar is a city in northern Ethiopia. It was the capital of Ethiopia from the 17th to mid-19th century and is famous for its medieval castles and churches. The city is located in the Amhara Region and is a popular tourist destination known for its historical sites, particularly the Royal Enclosure (Fasil Ghebbi), which is a UNESCO World Heritage site."
    }
    if (lowerMessage.includes("addis ababa")) {
      return "Addis Ababa is the capital and largest city of Ethiopia. Located in the highlands bordering the Great Rift Valley, it's the political and commercial heart of the country."
    }
    if (lowerMessage.includes("lalibela")) {
      return "Lalibela is a town in northern Ethiopia famous for its monolithic rock-cut churches. It is one of Ethiopia's holiest cities and a center of pilgrimage for Ethiopian Orthodox Christians."
    }
    return "I can provide information about many destinations in Ethiopia. Could you be more specific about which place you're interested in?"
  }

  // Check for accommodation inquiries
  if (lowerMessage.includes("hotel") || lowerMessage.includes("stay") || lowerMessage.includes("accommodation")) {
    return "Ethiopia offers a range of accommodation options from luxury hotels in Addis Ababa to eco-lodges near natural attractions. Popular hotel chains include Sheraton, Hilton, and Radisson Blu in the capital, while other regions offer unique boutique hotels and traditional lodges."
  }

  // Check for food inquiries
  if (lowerMessage.includes("food") || lowerMessage.includes("eat") || lowerMessage.includes("cuisine")) {
    return "Ethiopian cuisine is known for its rich flavors and unique dining style. Must-try dishes include injera (sourdough flatbread) with various wats (stews), tibs (sautéed meat), and the traditional coffee ceremony. Vegetarian options are plentiful, especially during fasting periods."
  }

  // Check for transportation inquiries
  if (lowerMessage.includes("transport") || lowerMessage.includes("travel") || lowerMessage.includes("get around")) {
    return "Transportation in Ethiopia includes domestic flights between major cities, public buses, minibuses, and taxis. For tourists, hiring a driver with a vehicle is often recommended for longer journeys. The new light rail in Addis Ababa provides convenient urban transportation."
  }

  // Default response
  return "I can help with information about Ethiopian destinations, accommodations, transportation, cuisine, and cultural experiences. What specific information are you looking for?"
}
