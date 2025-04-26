import { NextResponse } from "next/server"

// This would be replaced with actual AI-based itinerary generation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { destination, travelType, duration } = body

    // Validate input
    if (!destination || !travelType || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would call an AI service or algorithm
    // For now, we'll return a mock itinerary
    const itinerary = {
      id: "itin-" + Date.now(),
      destination,
      travelType,
      duration: Number.parseInt(duration),
      days: generateMockItinerary(destination, Number.parseInt(duration)),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(itinerary)
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}

function generateMockItinerary(destination: string, duration: number) {
  const activities = {
    Lalibela: [
      "Visit the rock-hewn churches",
      "Attend a traditional Ethiopian Orthodox service",
      "Explore the local market",
      "Hike to nearby monasteries",
      "Experience a traditional coffee ceremony",
      "Visit Yemrehana Krestos Church",
      "Sunset viewing from a nearby hill",
    ],
    Gondar: [
      "Explore Fasil Ghebbi (Royal Enclosure)",
      "Visit Debre Berhan Selassie Church",
      "Tour the Bath of Fasilides",
      "Visit the Falasha Village",
      "Explore local markets",
      "Day trip to Simien Mountains",
      "Traditional music and dance show",
    ],
    default: [
      "City tour and orientation",
      "Visit historical sites",
      "Cultural experience with locals",
      "Nature exploration",
      "Local cuisine tasting",
      "Shopping for souvenirs",
      "Relaxation day",
    ],
  }

  const destinationActivities = activities[destination as keyof typeof activities] || activities.default

  const days = []
  for (let i = 1; i <= duration; i++) {
    const dayActivities = []
    // Add 2-4 activities per day
    const numActivities = Math.floor(Math.random() * 3) + 2

    for (let j = 0; j < numActivities; j++) {
      const activityIndex = (i + j) % destinationActivities.length
      dayActivities.push({
        time: `${9 + j * 2}:00`,
        activity: destinationActivities[activityIndex],
        location: `${destination} - Location ${j + 1}`,
        duration: "2 hours",
      })
    }

    days.push({
      day: i,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      activities: dayActivities,
    })
  }

  return days
}
