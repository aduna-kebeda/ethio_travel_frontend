"use client"

import { Calendar, ArrowDownAZ, ArrowDown01, ArrowUp01 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterBarProps {
  sortOption: "date" | "priceLowToHigh" | "priceHighToLow" | "nameAZ"
  setSortOption: (option: "date" | "priceLowToHigh" | "priceHighToLow" | "nameAZ") => void
}

export function FilterBar({ sortOption, setSortOption }: FilterBarProps) {
  return (
    <div className="py-6 bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            className={`flex items-center px-4 py-2 ${
              sortOption === "date"
                ? "border-[#E91E63] text-[#E91E63] bg-pink-50"
                : "border-gray-300 text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63]"
            } rounded-md text-sm transition-all duration-200`}
            onClick={() => setSortOption("date")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>

          <Button
            variant="outline"
            className={`flex items-center px-4 py-2 ${
              sortOption === "priceLowToHigh"
                ? "border-[#E91E63] text-[#E91E63] bg-pink-50"
                : "border-gray-300 text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63]"
            } rounded-md text-sm transition-all duration-200`}
            onClick={() => setSortOption("priceLowToHigh")}
          >
            <ArrowDown01 className="h-4 w-4 mr-2" />
            Price Low To High
          </Button>

          <Button
            variant="outline"
            className={`flex items-center px-4 py-2 ${
              sortOption === "priceHighToLow"
                ? "border-[#E91E63] text-[#E91E63] bg-pink-50"
                : "border-gray-300 text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63]"
            } rounded-md text-sm transition-all duration-200`}
            onClick={() => setSortOption("priceHighToLow")}
          >
            <ArrowUp01 className="h-4 w-4 mr-2" />
            Price High To Low
          </Button>

          <Button
            variant="outline"
            className={`flex items-center px-4 py-2 ${
              sortOption === "nameAZ"
                ? "border-[#E91E63] text-[#E91E63] bg-pink-50"
                : "border-gray-300 text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63]"
            } rounded-md text-sm transition-all duration-200`}
            onClick={() => setSortOption("nameAZ")}
          >
            <ArrowDownAZ className="h-4 w-4 mr-2" />
            Name (A-Z)
          </Button>
        </div>
      </div>
    </div>
  )
}
