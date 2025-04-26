"use client"

import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import type { EventCategory } from "../types"

interface SearchFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: EventCategory) => void
  currentView: "calendar" | "list" | "map"
  setCurrentView: (view: "calendar" | "list" | "map") => void
}

export const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  currentView,
  setCurrentView,
}: SearchFilterProps) => {
  const categories: EventCategory[] = ["All", "Festival", "Religious", "Cultural", "Music", "Food", "Historical"]

  // Additional filter states (for mobile filter sheet)
  const [dateRange, setDateRange] = useState<[number, number]>([0, 3]) // 0-3 months
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")

  const handleReset = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setDateRange([0, 3])
    setPriceFilter("all")
    setLocationFilter("all")
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
      <div className="relative w-full md:w-1/3">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 border rounded-full focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
        />
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="flex gap-3 w-full md:w-auto">
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as EventCategory)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Filters */}
          <div className="block md:hidden w-full">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                  <SheetDescription>Refine your search to find the perfect events for your trip.</SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Category</h3>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value as EventCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Date Range (months from now)</h3>
                    <Slider
                      defaultValue={[0, 3]}
                      max={12}
                      step={1}
                      value={dateRange}
                      onValueChange={(value) => setDateRange(value as [number, number])}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Now</span>
                      <span>
                        {dateRange[0]} - {dateRange[1]} months
                      </span>
                      <span>1 year</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Price</h3>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="free">Free Events</SelectItem>
                        <SelectItem value="paid">Paid Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Location</h3>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="addis">Addis Ababa</SelectItem>
                        <SelectItem value="lalibela">Lalibela</SelectItem>
                        <SelectItem value="gondar">Gondar</SelectItem>
                        <SelectItem value="axum">Axum</SelectItem>
                        <SelectItem value="harar">Harar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <SheetFooter>
                  <Button variant="outline" onClick={handleReset}>
                    Reset All
                  </Button>
                  <SheetClose asChild>
                    <Button className="bg-[#E91E63] hover:bg-[#D81B60]">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Additional Filters */}
          <div className="hidden md:block">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
