import { NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const destinations = [
  {
    id: "1",
    name: "Lalibela",
    category: "Historical",
    image: "/placeholder.svg?height=400&width=600&text=Lalibela",
    description: "Fall in love with Lalibela's ancient rock-hewn churches",
    rating: 4.8,
    location: "Northern Ethiopia",
  },
  {
    id: "2",
    name: "Gondar",
    category: "Historical",
    image: "/placeholder.svg?height=400&width=600&text=Gondar",
    description: "Gondar is a place where magic and history intertwine",
    rating: 4.7,
    location: "Northern Ethiopia",
  },
  {
    id: "3",
    name: "Axum",
    category: "Historical",
    image: "/placeholder.svg?height=400&width=600&text=Axum",
    description: "Fall in love with Axum's ancient charm and mysterious wonders",
    rating: 4.6,
    location: "Northern Ethiopia",
  },
  {
    id: "4",
    name: "Danakil Depression",
    category: "Natural",
    image: "/placeholder.svg?height=400&width=600&text=Danakil",
    description: "You don't want to miss this surreal landscape",
    rating: 4.9,
    location: "Afar Region",
  },
  {
    id: "5",
    name: "Simien Mountains",
    category: "Natural",
    image: "/placeholder.svg?height=400&width=600&text=Simien",
    description: "Trek through breathtaking landscapes and encounter unique wildlife",
    rating: 4.8,
    location: "Northern Ethiopia",
  },
  {
    id: "6",
    name: "Omo Valley",
    category: "Cultural",
    image: "/placeholder.svg?height=400&width=600&text=Omo+Valley",
    description: "Experience the diverse tribal cultures of southern Ethiopia",
    rating: 4.7,
    location: "Southern Ethiopia",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  let filteredDestinations = [...destinations]

  if (category && category !== "All") {
    filteredDestinations = filteredDestinations.filter((destination) => destination.category === category)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredDestinations = filteredDestinations.filter(
      (destination) =>
        destination.name.toLowerCase().includes(searchLower) ||
        destination.description.toLowerCase().includes(searchLower) ||
        destination.location.toLowerCase().includes(searchLower),
    )
  }

  return NextResponse.json(filteredDestinations)
}
