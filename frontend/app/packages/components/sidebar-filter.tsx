"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface SidebarFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  selectedDurations: string[]
  onDurationChange: (duration: string) => void
}

export function SidebarFilter({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedCategories,
  onCategoryChange,
  selectedDurations,
  onDurationChange,
}: SidebarFilterProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [showClearSearch, setShowClearSearch] = useState(false)

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
    setShowClearSearch(searchTerm.length > 0)
  }, [searchTerm])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(localSearchTerm)
    setShowClearSearch(localSearchTerm.length > 0)
  }

  const clearSearch = () => {
    setLocalSearchTerm("")
    setSearchTerm("")
    setShowClearSearch(false)
  }

  const handleReset = () => {
    setLocalSearchTerm("")
    setSearchTerm("")
    setPriceRange([0, 2000])
    setDestination("")
    setDate("")
    setShowClearSearch(false)
  }

  const categories = ["Historical", "Cultural", "Adventure", "Nature", "Religious"]
  const durations = ["1-3 days", "4-6 days", "7-9 days", "10+ days"]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Plan Your Trip</h2>
      <p className="text-gray-600 text-sm mb-6">
        Fill in your travel preferences to find the perfect Ethiopian adventure. Our AI will suggest the best packages
        based on your interests.
      </p>

      <form onSubmit={handleSearchSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Tour</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={localSearchTerm}
              onChange={(e) => {
                setLocalSearchTerm(e.target.value)
                setShowClearSearch(e.target.value.length > 0)
              }}
              className="w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91E63]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {showClearSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Where to?</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91E63]"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91E63]"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by price</label>
          <div className="relative pt-1 px-2">
            <Slider
              defaultValue={[0, 2000]}
              max={2000}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Price: ${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryChange(category)}
                  className="h-4 w-4 text-[#E91E63] focus:ring-[#E91E63] border-gray-300 rounded"
                />
                <Label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
          <div className="space-y-2">
            {durations.map((duration) => (
              <div key={duration} className="flex items-center">
                <Checkbox
                  id={`duration-${duration}`}
                  checked={selectedDurations.includes(duration)}
                  onCheckedChange={() => onDurationChange(duration)}
                  className="h-4 w-4 text-[#E91E63] focus:ring-[#E91E63] border-gray-300 rounded"
                />
                <Label htmlFor={`duration-${duration}`} className="ml-2 text-sm text-gray-700">
                  {duration}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Button type="submit" className="w-full rounded-full bg-[#E91E63] hover:bg-[#D81B60] text-white transition-colors">
            Search
          </Button>

          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="w-full rounded-full border-[#E91E63] text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-colors"
          >
            Reset Filters
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=300&width=400&text=Special+Offer"
            alt="Special Offer"
            width={400}
            height={300}
            className="rounded-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-bold text-lg">Special Offer</h3>
            <p className="text-white text-sm">Get 20% off on selected packages</p>
            <Button className="mt-2 bg-white text-[#E91E63] hover:bg-gray-100 transition-colors" size="sm">
              View Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
