"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface SearchFilterProps {
  categories: string[]
}

export const SearchFilter = ({ categories }: SearchFilterProps) => {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <section className="py-6 bg-white rounded-xl shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search articles..."
            className="pl-10 rounded-full border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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
  )
}
