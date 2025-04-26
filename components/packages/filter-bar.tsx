"use client"

import { Calendar } from "@/components/ui/calendar"

import { ArrowDownAZ, ArrowDown01, ArrowUp01 } from "lucide-react"

interface FilterBarProps {
  sortOption: "date" | "priceLowToHigh" | "priceHighToLow" | "nameAZ"
  setSortOption: (option: "date" | "priceLowToHigh" | "priceHighToLow" | "nameAZ") => void
}

export function FilterBar({ sortOption, setSortOption }: FilterBarProps) {
  return (
    <div className="py-6 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            className={`flex items-center px-4 py-2 border ${
              sortOption === "date" ? "border-[#E91E63] text-[#E91E63]" : "border-gray-300 text-gray-700"
            } rounded-md text-sm`}
            onClick={() => setSortOption("date")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </button>

          <button
            className={`flex items-center px-4 py-2 border ${
              sortOption === "priceLowToHigh" ? "border-[#E91E63] text-[#E91E63]" : "border-gray-300 text-gray-700"
            } rounded-md text-sm`}
            onClick={() => setSortOption("priceLowToHigh")}
          >
            <ArrowDown01 className="h-4 w-4 mr-2" />
            Price Low To High
          </button>

          <button
            className={`flex items-center px-4 py-2 border ${
              sortOption === "priceHighToLow" ? "border-[#E91E63] text-[#E91E63]" : "border-gray-300 text-gray-700"
            } rounded-md text-sm`}
            onClick={() => setSortOption("priceHighToLow")}
          >
            <ArrowUp01 className="h-4 w-4 mr-2" />
            Price High To Low
          </button>

          <button
            className={`flex items-center px-4 py-2 border ${
              sortOption === "nameAZ" ? "border-[#E91E63] text-[#E91E63]" : "border-gray-300 text-gray-700"
            } rounded-md text-sm`}
            onClick={() => setSortOption("nameAZ")}
          >
            <ArrowDownAZ className="h-4 w-4 mr-2" />
            Name (A-Z)
          </button>
        </div>
      </div>
    </div>
  )
}
