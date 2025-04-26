"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PackageCard } from "./components/package-card"
import { FilterBar } from "./components/filter-bar"
import { SidebarFilter } from "./components/sidebar-filter"

// Package type definition
interface Package {
  id: string
  title: string
  location: string
  region: string
  price: number
  duration: string
  image: string
  description: string
  category: string[]
}

export default function PackagesPage() {
  const router = useRouter()

  // State for packages and filters
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortOption, setSortOption] = useState<"date" | "priceLowToHigh" | "priceHighToLow" | "nameAZ">("date")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for packages
  useEffect(() => {
    // Simulate API fetch with a delay
    setIsLoading(true)

    setTimeout(() => {
      const mockPackages: Package[] = [
        {
          id: "1",
          title: "History is not about the past but a map of the past",
          location: "Gondar",
          region: "Amhara region",
          price: 600,
          duration: "5 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Gondar+Castle",
          description: "Explore the medieval castles and rich history of Gondar, the former capital of Ethiopia.",
          category: ["Historical", "Cultural"],
        },
        {
          id: "2",
          title: "Fall in love with Axum's ancient charm and timeless wonders.",
          location: "Axum",
          region: "Tigray region",
          price: 500,
          duration: "3 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Axum+Obelisk",
          description: "Discover the ancient kingdom of Axum with its mysterious obelisks and historical treasures.",
          category: ["Historical", "Religious"],
        },
        {
          id: "3",
          title: "Fall in love with Axum's ancient charm and timeless wonders.",
          location: "Axum",
          region: "Tigray region",
          price: 1000,
          duration: "7 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Axum+Church",
          description: "Immerse yourself in the rich religious heritage of Axum with visits to ancient churches.",
          category: ["Religious", "Cultural"],
        },
        {
          id: "4",
          title: "The unique character as a symbol of taste and orientation",
          location: "Harar",
          region: "Harari region",
          price: 700,
          duration: "4 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Harar+City",
          description:
            "Experience the unique walled city of Harar with its colorful markets and rich Islamic heritage.",
          category: ["Cultural", "Historical"],
        },
        {
          id: "5",
          title: "The unique character as a symbol of taste and orientation",
          location: "Omo Valley",
          region: "SNNPR",
          price: 900,
          duration: "6 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Omo+Valley+People",
          description: "Meet the diverse tribes of the Omo Valley and experience their unique cultures and traditions.",
          category: ["Cultural", "Adventure"],
        },
        {
          id: "6",
          title: "You don't want to pitch a tent and live inside the Louvre",
          location: "Danakil",
          region: "Afar region",
          price: 800,
          duration: "5 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Danakil+Depression",
          description:
            "Explore the otherworldly landscapes of the Danakil Depression, one of the hottest places on Earth.",
          category: ["Adventure", "Nature"],
        },
        {
          id: "7",
          title: "You don't want to pitch a tent and live inside the Louvre",
          location: "Lalibela",
          region: "Amhara region",
          price: 400,
          duration: "3 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Lalibela+Churches",
          description: "Marvel at the rock-hewn churches of Lalibela, a UNESCO World Heritage site.",
          category: ["Religious", "Historical"],
        },
        {
          id: "8",
          title: "The unique character as a symbol of taste and orientation",
          location: "Bale Mountains",
          region: "Oromia region",
          price: 800,
          duration: "5 days tour",
          image: "/placeholder.svg?height=300&width=400&text=Bale+Mountains",
          description: "Trek through the stunning Bale Mountains National Park and spot endemic wildlife.",
          category: ["Nature", "Adventure"],
        },
      ]

      setPackages(mockPackages)
      setFilteredPackages(mockPackages)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort packages
  useEffect(() => {
    let result = [...packages]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply price range filter
    result = result.filter((pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1])

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((pkg) => pkg.category.some((cat) => selectedCategories.includes(cat)))
    }

    // Apply duration filter
    if (selectedDurations.length > 0) {
      result = result.filter((pkg) => {
        const days = Number.parseInt(pkg.duration.split(" ")[0])

        return selectedDurations.some((duration) => {
          if (duration === "1-3 days" && days >= 1 && days <= 3) return true
          if (duration === "4-6 days" && days >= 4 && days <= 6) return true
          if (duration === "7-9 days" && days >= 7 && days <= 9) return true
          if (duration === "10+ days" && days >= 10) return true
          return false
        })
      })
    }

    // Apply sorting
    switch (sortOption) {
      case "date":
        // For mock data, we'll just keep the original order
        break
      case "priceLowToHigh":
        result.sort((a, b) => a.price - b.price)
        break
      case "priceHighToLow":
        result.sort((a, b) => b.price - a.price)
        break
      case "nameAZ":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredPackages(result)
  }, [packages, searchTerm, priceRange, sortOption, selectedCategories, selectedDurations])

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Handle duration selection
  const handleDurationChange = (duration: string) => {
    setSelectedDurations((prev) => (prev.includes(duration) ? prev.filter((d) => d !== duration) : [...prev, duration]))
  }

  // Handle search button click
  const handleSearchClick = () => {
    // In a real app, this might trigger an API call
    console.log("Search clicked with term:", searchTerm)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600&text=Travel+With+Us')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white italic mb-8">Travel With Us</h1>
            <button
              onClick={handleSearchClick}
              className="bg-[#E91E63] text-white px-6 py-2 rounded-full hover:bg-[#D81B60] transition-all duration-300"
            >
              SEARCH TOUR
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar sortOption={sortOption} setSortOption={setSortOption} />

      {/* Packages Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="col-span-1 order-2 md:order-1">
              <SidebarFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                selectedDurations={selectedDurations}
                onDurationChange={handleDurationChange}
              />
            </div>

            {/* Packages */}
            <div className="col-span-2 order-1 md:order-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E63]"></div>
                </div>
              ) : filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      id={pkg.id}
                      title={pkg.title}
                      location={pkg.location}
                      region={pkg.region}
                      price={pkg.price}
                      duration={pkg.duration}
                      image={pkg.image}
                      description={pkg.description}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setPriceRange([0, 2000])
                      setSelectedCategories([])
                      setSelectedDurations([])
                    }}
                    className="bg-[#E91E63] text-white px-6 py-2 rounded-md hover:bg-[#D81B60]"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
