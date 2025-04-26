"use client"

import { Search, MapPin } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

interface SidebarFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
}

export function SidebarFilter({ searchTerm, setSearchTerm, priceRange, setPriceRange }: SidebarFilterProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Plan Your Trip</h2>
      <p className="text-gray-600 text-sm mb-6">
        Fill in your travel preferences to find the perfect Ethiopian adventure. Our AI will suggest the best packages
        based on your interests.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Tour</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91E63]"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Where to?</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Destination"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91E63]"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by price</label>
        <div className="relative pt-1">
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

      <button className="w-full bg-[#E91E63] text-white py-2 rounded-md hover:bg-[#D81B60]">Search</button>

      <div className="mt-8">
        <Image
          src="/placeholder.svg?height=300&width=400&text=Travel+Accessories"
          alt="Travel Accessories"
          width={400}
          height={300}
          className="rounded-lg"
        />
      </div>
    </div>
  )
}
