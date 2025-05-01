"use client"

import type React from "react"

import { Bell, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface HeroSectionProps {
  onOpenSubscribeModal: () => void
}

export const HeroSection = ({ onOpenSubscribeModal }: HeroSectionProps) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section
      className="relative h-[550px] md:h-[600px] bg-cover bg-center rounded-xl overflow-hidden"
      style={{ backgroundImage: "url('/assets/run.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="inline-block bg-[#E91E63] text-white text-xs font-bold px-3 py-1.5 rounded-md mb-6">
            DISCOVER ETHIOPIA'S EVENTS
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Experience Ethiopia's Rich Cultural Celebrations
          </h1>
          <p className="text-white text-lg mb-8 opacity-90 max-w-xl">
            From ancient religious ceremonies to vibrant cultural festivals, discover Ethiopia's most captivating events
            and plan your perfect trip.
          </p>

          <form onSubmit={handleSearch} className="relative mb-8">
            <input
              type="text"
              placeholder="Search for events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 px-5 pl-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E91E63] shadow-md"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#E91E63] hover:bg-[#D81B60] rounded-full px-6 py-2.5"
            >
              Find Events
            </Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={onOpenSubscribeModal}
              className="bg-[#E91E63] text-white px-6 py-3 rounded-full hover:bg-[#D81B60] flex items-center"
            >
              <Bell className="mr-2 h-5 w-5" />
              Get Event Notifications
            </Button>
            <Button
              onClick={() => router.push("/events?view=calendar")}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 flex items-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              View Calendar
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
