"use client"

import { useState } from "react"
import { Container } from "@/components/container"
import { HeroSection } from "./components/hero-section"
import { DestinationFilters } from "./components/destination-filters"
import { DestinationGrid } from "./components/destination-grid"
import { TripPlanner } from "./components/trip-planner"
import { ScrollToTop } from "@/components/scroll-to-top"

// Sample destination data
const destinationsData = [
  {
    id: 1,
    name: "Lalibela",
    category: "Historical",
    image: "/placeholder.svg?height=400&width=600&text=Lalibela",
    description: "Explore the rock-hewn churches of this UNESCO World Heritage site",
    rating: 4.8,
    reviews: 124,
    location: "Northern Ethiopia",
    price: "$120",
    featured: true,
  },
  {
    id: 2,
    name: "Gondar",
    category: "Historical",
    image: "/placeholder.svg?height=400&width=600&text=Gondar",
    description: "Discover the medieval castles and royal enclosures",
    rating: 4.7,
    reviews: 98,
    location: "Northern Ethiopia",
    price: "$95",
    featured: true,
  },
  {
    id: 3,
    name: "Axum",
    category: "Historical",
    image: "/placeholder.svg?height=400&width=600&text=Axum",
    description: "Visit the ancient kingdom and its mysterious obelisks",
    rating: 4.6,
    reviews: 87,
    location: "Northern Ethiopia",
    price: "$85",
    featured: false,
  },
  {
    id: 4,
    name: "Danakil Depression",
    category: "Natural",
    image: "/placeholder.svg?height=400&width=600&text=Danakil",
    description: "Experience one of the hottest and most surreal landscapes on Earth",
    rating: 4.9,
    reviews: 156,
    location: "Afar Region",
    price: "$200",
    featured: true,
  },
  {
    id: 5,
    name: "Simien Mountains",
    category: "Natural",
    image: "/placeholder.svg?height=400&width=600&text=Simien",
    description: "Trek through breathtaking landscapes and encounter unique wildlife",
    rating: 4.8,
    reviews: 112,
    location: "Northern Ethiopia",
    price: "$150",
    featured: true,
  },
  {
    id: 6,
    name: "Omo Valley",
    category: "Cultural",
    image: "/placeholder.svg?height=400&width=600&text=Omo+Valley",
    description: "Experience the diverse tribal cultures of southern Ethiopia",
    rating: 4.7,
    reviews: 92,
    location: "Southern Ethiopia",
    price: "$180",
    featured: false,
  },
  {
    id: 7,
    name: "Bale Mountains",
    category: "Natural",
    image: "/placeholder.svg?height=400&width=600&text=Bale+Mountains",
    description: "Discover unique wildlife and stunning alpine scenery",
    rating: 4.6,
    reviews: 78,
    location: "Oromia Region",
    price: "$130",
    featured: false,
  },
  {
    id: 8,
    name: "Harar",
    category: "Cultural",
    image: "/placeholder.svg?height=400&width=600&text=Harar",
    description: "Explore the ancient walled city and its unique culture",
    rating: 4.5,
    reviews: 65,
    location: "Eastern Ethiopia",
    price: "$90",
    featured: false,
  },
  {
    id: 9,
    name: "Lake Tana",
    category: "Natural",
    image: "/placeholder.svg?height=400&width=600&text=Lake+Tana",
    description: "Visit the source of the Blue Nile and its island monasteries",
    rating: 4.4,
    reviews: 58,
    location: "Amhara Region",
    price: "$75",
    featured: false,
  },
]

export default function DestinationsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  const categories = ["All", "Historical", "Natural", "Cultural", "Religious", "Urban"]

  // Filter destinations based on category and search term
  const filteredDestinations = destinationsData.filter((destination) => {
    const matchesCategory = activeCategory === "All" || destination.category === activeCategory
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === "featured") {
      return a.featured === b.featured ? 0 : a.featured ? -1 : 1
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "price-low") {
      return Number.parseInt(a.price.replace("$", "")) - Number.parseInt(b.price.replace("$", ""))
    } else if (sortBy === "price-high") {
      return Number.parseInt(b.price.replace("$", "")) - Number.parseInt(a.price.replace("$", ""))
    }
    return 0
  })

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <HeroSection />

        <Container className="py-8">
          <div className="space-y-8">
            <DestinationFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />

            <DestinationGrid destinations={sortedDestinations} />

            <TripPlanner />
          </div>
        </Container>
      </main>

      <ScrollToTop />
    </div>
  )
}
