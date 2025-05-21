/**
 * Message parser utility for handling rich content in chatbot messages
 */

/**
 * Parse markdown content in messages
 * @param content The message content to parse
 * @returns HTML content with markdown parsed
 */
export const parseMarkdown = (content: string): string => {
  if (!content) return ""

  // Replace **bold** with <strong>bold</strong>
  let parsedContent = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Replace *italic* with <em>italic</em>
  parsedContent = parsedContent.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Replace [link text](url) with <a href="url">link text</a>
  parsedContent = parsedContent.replace(
    /\[(.*?)\]$$(.*?)$$/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>',
  )

  // Replace bullet lists
  parsedContent = parsedContent.replace(/^\s*-\s+(.*?)$/gm, "<li>$1</li>")
  parsedContent = parsedContent.replace(/<li>(.*?)<\/li>(\s*)<li>/g, "<li>$1</li><li>")
  parsedContent = parsedContent.replace(/(<li>.*?<\/li>)+/g, "<ul class='list-disc pl-5 my-2'>$&</ul>")

  // Replace numbered lists
  parsedContent = parsedContent.replace(/^\s*(\d+)\.\s+(.*?)$/gm, "<li>$2</li>")

  // Replace line breaks with <br>
  parsedContent = parsedContent.replace(/\n/g, "<br>")

  return parsedContent
}

/**
 * Extract special content types from message
 * @param content The message content
 * @returns Object with extracted special content
 */
export const extractSpecialContent = (
  content: string,
): {
  text: string
  locations?: string[]
  dates?: string[]
  prices?: string[]
  hasImage?: boolean
  hasMap?: boolean
  hasItinerary?: boolean
} => {
  const result = {
    text: content,
    locations: [] as string[],
    dates: [] as string[],
    prices: [] as string[],
    hasImage: false,
    hasMap: false,
    hasItinerary: false,
  }

  // Extract locations (simple implementation - could be enhanced with NER)
  const locationMatches = content.match(/(?:in|at|to|from|visit|explore)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g)
  if (locationMatches) {
    result.locations = locationMatches.map((match) => match.replace(/(?:in|at|to|from|visit|explore)\s+/, ""))
  }

  // Extract dates
  const dateMatches = content.match(
    /\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/g,
  )
  if (dateMatches) {
    result.dates = dateMatches
  }

  // Extract prices
  const priceMatches = content.match(/\$\d+(?:\.\d{2})?|\d+\s+(?:USD|ETB|Birr)/g)
  if (priceMatches) {
    result.prices = priceMatches
  }

  // Check for image references
  result.hasImage = /\bphoto\b|\bimage\b|\bpicture\b/i.test(content)

  // Check for map references
  result.hasMap = /\bmap\b|\blocation\b|\bdirection/i.test(content)

  // Check for itinerary references
  result.hasItinerary = /\bitinerary\b|\bschedule\b|\bplan\b/i.test(content)

  return result
}

/**
 * Detect the intent of a user message
 * @param message The user message
 * @returns The detected intent
 */
export const detectIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (/\b(?:hi|hello|hey|greetings)\b/i.test(lowerMessage)) {
    return "greeting"
  }

  if (/\b(?:bye|goodbye|see you|farewell)\b/i.test(lowerMessage)) {
    return "farewell"
  }

  if (/\b(?:thanks|thank you|appreciate)\b/i.test(lowerMessage)) {
    return "thanks"
  }

  if (/\b(?:help|assist|support)\b/i.test(lowerMessage)) {
    return "help"
  }

  if (/\b(?:book|reserve|purchase)\b/i.test(lowerMessage)) {
    return "booking"
  }

  if (/\b(?:cancel|refund)\b/i.test(lowerMessage)) {
    return "cancellation"
  }

  if (/\b(?:price|cost|fee|how much)\b/i.test(lowerMessage)) {
    return "pricing"
  }

  if (/\b(?:food|eat|restaurant|cuisine|dish)\b/i.test(lowerMessage)) {
    return "food"
  }

  if (/\b(?:transport|travel|flight|bus|taxi|car)\b/i.test(lowerMessage)) {
    return "transportation"
  }

  if (/\b(?:hotel|accommodation|stay|lodge|resort)\b/i.test(lowerMessage)) {
    return "accommodation"
  }

  if (/\b(?:activity|attraction|visit|see|tour|explore)\b/i.test(lowerMessage)) {
    return "activities"
  }

  if (/\b(?:safety|security|safe|danger|risk)\b/i.test(lowerMessage)) {
    return "safety"
  }

  if (/\b(?:currency|money|exchange|cash|payment)\b/i.test(lowerMessage)) {
    return "currency"
  }

  if (/\b(?:language|speak|communication)\b/i.test(lowerMessage)) {
    return "language"
  }

  if (/\b(?:culture|tradition|custom|festival|holiday)\b/i.test(lowerMessage)) {
    return "culture"
  }

  if (/\b(?:itinerary|plan|schedule|agenda)\b/i.test(lowerMessage)) {
    return "itinerary"
  }

  if (/\b(?:recommendation|suggest|recommend|best)\b/i.test(lowerMessage)) {
    return "recommendation"
  }

  // Check for location names
  const ethiopianLocations = [
    "addis",
    "addis ababa",
    "gondar",
    "lalibela",
    "axum",
    "bahir dar",
    "harar",
    "dire dawa",
    "mekelle",
    "hawassa",
    "arba minch",
    "jimma",
  ]

  for (const location of ethiopianLocations) {
    if (lowerMessage.includes(location)) {
      return "location"
    }
  }

  return "general_query"
}

/**
 * Generate quick replies based on message content and intent
 * @param message The message content
 * @param intent The detected intent
 * @returns Array of quick reply options
 */
export const generateQuickReplies = (message: string, intent: string): { id: string; text: string }[] => {
  const replies: { id: string; text: string }[] = []

  switch (intent) {
    case "greeting":
      replies.push(
        { id: "popular_dest", text: "Popular destinations" },
        { id: "best_time", text: "Best time to visit" },
        { id: "plan_trip", text: "Help me plan a trip" },
        { id: "about_ethiopia", text: "Tell me about Ethiopia" },
      )
      break

    case "food":
      replies.push(
        { id: "traditional_food", text: "Traditional dishes" },
        { id: "vegetarian", text: "Vegetarian options" },
        { id: "coffee_ceremony", text: "Coffee ceremony" },
        { id: "restaurant_recs", text: "Restaurant recommendations" },
      )
      break

    case "transportation":
      replies.push(
        { id: "domestic_flights", text: "Domestic flights" },
        { id: "public_transport", text: "Public transportation" },
        { id: "car_rental", text: "Car rental options" },
        { id: "airport_transfer", text: "Airport transfers" },
      )
      break

    case "accommodation":
      replies.push(
        { id: "luxury_hotels", text: "Luxury hotels" },
        { id: "budget_options", text: "Budget accommodations" },
        { id: "unique_stays", text: "Unique places to stay" },
        { id: "best_locations", text: "Best areas to stay" },
      )
      break

    case "activities":
      replies.push(
        { id: "historical_sites", text: "Historical sites" },
        { id: "nature_adventures", text: "Nature & adventures" },
        { id: "cultural_exp", text: "Cultural experiences" },
        { id: "day_trips", text: "Day trips" },
      )
      break

    case "safety":
      replies.push(
        { id: "safety_tips", text: "General safety tips" },
        { id: "health_advice", text: "Health advice" },
        { id: "emergency_contacts", text: "Emergency contacts" },
        { id: "safe_areas", text: "Safe areas to visit" },
      )
      break

    case "currency":
      replies.push(
        { id: "exchange_rates", text: "Exchange rates" },
        { id: "currency_tips", text: "Money tips" },
        { id: "atm_locations", text: "ATM locations" },
        { id: "payment_methods", text: "Accepted payment methods" },
      )
      break

    case "culture":
      replies.push(
        { id: "cultural_customs", text: "Cultural customs" },
        { id: "festivals", text: "Festivals & events" },
        { id: "etiquette", text: "Etiquette tips" },
        { id: "traditional_arts", text: "Traditional arts" },
      )
      break

    case "itinerary":
      replies.push(
        { id: "3day_itinerary", text: "3-day itinerary" },
        { id: "7day_itinerary", text: "7-day itinerary" },
        { id: "14day_itinerary", text: "14-day itinerary" },
        { id: "custom_itinerary", text: "Custom itinerary" },
      )
      break

    default:
      // Default quick replies for any other intent
      replies.push(
        { id: "popular_dest", text: "Popular destinations" },
        { id: "best_time", text: "Best time to visit" },
        { id: "recommended_tours", text: "Recommended tours" },
        { id: "travel_tips", text: "Travel tips" },
      )
  }

  return replies
}