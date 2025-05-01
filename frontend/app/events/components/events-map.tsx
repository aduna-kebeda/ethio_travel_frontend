"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import type { Event } from "../types"

interface EventsMapProps {
  events: Event[]
}

export const EventsMap = ({ events }: EventsMapProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  useEffect(() => {
    // This would be where you initialize a map library like Google Maps or Mapbox
    // For this example, we'll just simulate the map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter((event) => event.coordinates)

  return (
    <section className="py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Map Area */}
          <div className="w-full md:w-2/3 h-[300px] md:h-full bg-gray-200 relative">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E63]"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-[#E91E63] mx-auto mb-6 opacity-80" />
                  <p className="text-gray-600 text-lg font-medium mb-2">Interactive Map</p>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Explore event locations across Ethiopia. The interactive map would display here with event markers.
                    <br />
                    <span className="text-sm block mt-2 text-gray-400">(Map integration requires API keys)</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Events List */}
          <div className="w-full md:w-1/3 h-[300px] md:h-full overflow-y-auto border-l">
            <div className="p-4 bg-gray-50 border-b sticky top-0 z-10">
              <h3 className="font-bold">Events on Map</h3>
              <p className="text-sm text-gray-500">{eventsWithCoordinates.length} events with locations</p>
            </div>
            <div className="divide-y">
              {eventsWithCoordinates.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedEvent?.id === event.id ? "bg-pink-50 border-l-4 border-[#E91E63]" : ""
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <Card className="mt-6 border-t-4 border-[#E91E63] animate-fadeIn shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3">{selectedEvent.title}</h3>
            <p className="text-gray-600 mb-5">{selectedEvent.shortDescription}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-[#E91E63]" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm">{formatDate(selectedEvent.date)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-[#E91E63]" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm">{selectedEvent.time}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-[#E91E63]" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm">{selectedEvent.location}</p>
                </div>
              </div>
            </div>

            <Link href={`/events/${selectedEvent.id}`} className="block">
              <button className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white py-2.5 rounded-md transition-colors font-medium">
                View Event Details
              </button>
            </Link>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
