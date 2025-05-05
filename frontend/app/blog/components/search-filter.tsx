"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useCallback } from "react"
import { ClientOnly } from "@/components/client-only"

interface SearchFilterProps {
  categories: string[]
  onSearch?: (query: string) => void // Optional callback for search
  onCategoryChange?: (category: string) => void // Optional callback for category change
}

export const SearchFilter = ({
  categories = [],
  onSearch,
  onCategoryChange,
}: SearchFilterProps) => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Handle category click
  const handleCategoryClick = useCallback(
    (category: string) => {
      setActiveCategory(category)
      if (onCategoryChange) {
        onCategoryChange(category)
      }
    },
    [onCategoryChange]
  )

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value
      setSearchQuery(query)
      if (onSearch) {
        onSearch(query)
      }
    },
    [onSearch]
  )

  // Ensure unique categories, removing any duplicate "All"
  const uniqueCategories = ["All", ...categories.filter((cat) => cat.toLowerCase() !== "all")]

  return (
    <ClientOnly>
      <section className="py-6 bg-white rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 rounded-full border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {uniqueCategories.map((category, index) => (
              <button
                key={`${category}-${index}`} // Use index to ensure uniqueness
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                  category === activeCategory
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ClientOnly>
  )
}