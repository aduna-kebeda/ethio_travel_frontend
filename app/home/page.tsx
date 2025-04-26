"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./components/hero-section"
import { PartnersSection } from "./components/partners-section"
import { RomanticDestinations } from "./components/romantic-destinations"
import { PopularPackages } from "./components/popular-packages"
import { ResortFinder } from "./components/resort-finder"
import { HolidayBanner } from "./components/holiday-banner"
import { CityTours } from "./components/city-tours"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#E91E63] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PartnersSection />
      <RomanticDestinations />
      <PopularPackages />
      <ResortFinder />
      <HolidayBanner />
      <CityTours />
    </div>
  )
}
