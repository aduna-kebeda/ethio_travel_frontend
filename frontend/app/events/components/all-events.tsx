"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Event } from "../types"

interface AllEventsProps {
  events: Event[]
  searchTerm: string
  selectedCategory: string
  selectedMonth: number
  selectedYear: number
  resetFilters: () => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
}

export const AllEvents = ({
  events,
  searchTerm,
  selectedCategory,
  selectedMonth,
  selectedYear,
  resetFilters,
  setSearchTerm,
  setSelectedCategory,
}: AllEventsProps) => {
  const [sortBy, setSortBy] = useState<"date" | "name" | "location">("date")
  const [showFilters, setShowFilters] = useState(false)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format short date
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Filter events based on search term, category, and date
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory

    const eventDate = new Date(event.date)
    const matchesDate = eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear

    return matchesSearch && matchesCategory && matchesDate
  })

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "location") {
      return a.location.localeCompare(b.location)
    }
    return 0
  })

  // Get active filters count
  const activeFiltersCount = (searchTerm ? 1 : 0) + (selectedCategory !== "All" ? 1 : 0)

  return (
    <section className="py-12 bg-gray-50 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold">All Events</h2>
            <p className="text-gray-500 mt-1">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name" | "location")}
                className="border rounded-md px-3 py-1.5 text-sm bg-white"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="location">Location</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
              Clear all
            </Button>
          </div>
        )}

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="block group">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-52">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#E91E63] hover:bg-[#E91E63]">{event.category}</Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-xs font-bold text-[#E91E63]">{formatShortDate(event.date)}</div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-[#E91E63] transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.shortDescription}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2 text-[#E91E63]" />
                        <span className="text-xs">{event.time}</span>
                      </div>

                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-[#E91E63]" />
                        <span className="text-xs line-clamp-1">{event.location}</span>
                      </div>

                      {event.ticketPrice && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs font-medium">
                            {event.ticketPrice === "Free" ? (
                              <span className="text-green-600">Free Event</span>
                            ) : (
                              <span>{event.ticketPrice}</span>
                            )}
                          </span>
                          <span className="text-xs text-[#E91E63] font-medium group-hover:underline">
                            View Details →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <p className="text-gray-600 mb-4">No events found matching your criteria.</p>
            <Button onClick={resetFilters} className="bg-[#E91E63] hover:bg-[#D81B60] transition-colors">
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
