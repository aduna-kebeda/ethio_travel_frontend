"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { getPackageCategories, getPackageRegions } from "@/app/actions/package-actions"

interface SidebarFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  selectedDurations: string[]
  onDurationChange: (duration: string) => void
  selectedRegions?: string[]
  onRegionChange?: (region: string) => void
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
  selectedRegions = [],
  onRegionChange,
}: SidebarFilterProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])

  useEffect(() => {
    const fetchFilterData = async () => {
      const [categoriesData, regionsData] = await Promise.all([getPackageCategories(), getPackageRegions()])

      setCategories(categoriesData)
      setRegions(regionsData)
    }

    fetchFilterData()
  }, [])

  const durations = [
    { id: "1-3 days", label: "1-3 days" },
    { id: "4-6 days", label: "4-6 days" },
    { id: "7-9 days", label: "7-9 days" },
    { id: "10+ days", label: "10+ days" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Search</h3>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={priceRange}
            min={0}
            max={5000}
            step={100}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">${priceRange[0]}</span>
            <span className="text-sm text-gray-600">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {onRegionChange && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Regions</h3>
          <div className="space-y-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => onRegionChange(region)}
                />
                <label
                  htmlFor={`region-${region}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Duration</h3>
        <div className="space-y-2">
          {durations.map((duration) => (
            <div key={duration.id} className="flex items-center">
              <Checkbox
                id={`duration-${duration.id}`}
                checked={selectedDurations.includes(duration.id)}
                onCheckedChange={() => onDurationChange(duration.id)}
              />
              <label
                htmlFor={`duration-${duration.id}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {duration.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => {
          setSearchTerm("")
          setPriceRange([0, 5000])
          onCategoryChange("")
          onDurationChange("")
          if (onRegionChange) onRegionChange("")
        }}
        variant="outline"
        className="w-full border-[#E91E63] text-[#E91E63] hover:bg-[#E91E63] hover:text-white"
      >
        Reset Filters
      </Button>
    </div>
  )
}
