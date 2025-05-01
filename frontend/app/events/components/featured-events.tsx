import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Event } from "../types"

interface FeaturedEventsProps {
  events: Event[]
}

export const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
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

  if (events.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Link href="/events/featured" className="text-[#E91E63] hover:underline text-sm font-medium">
            View all featured events
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group"
            >
              <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-[#E91E63] hover:bg-[#E91E63]">{event.category}</Badge>
                </div>
              </div>
              <div className="md:w-3/5 p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#E91E63] transition-colors">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.shortDescription}</p>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2 text-[#E91E63]" />
                    <span className="text-sm">
                      {formatDate(event.date)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2 text-[#E91E63]" />
                    <span className="text-sm">{event.time}</span>
                  </div>

                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2 text-[#E91E63]" />
                    <span className="text-sm">{event.location}</span>
                  </div>

                  {event.organizer && (
                    <div className="flex items-center text-gray-500">
                      <span className="text-sm">
                        <span className="font-medium">Organizer:</span> {event.organizer}
                      </span>
                    </div>
                  )}

                  {event.ticketPrice && (
                    <div className="flex items-center text-gray-500">
                      <span className="text-sm">
                        <span className="font-medium">Price:</span> {event.ticketPrice}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/events/${event.id}`}>
                    <button className="bg-[#E91E63] text-white px-5 py-2.5 rounded-full hover:bg-[#D81B60] transition-colors text-sm font-medium">
                      View Details
                    </button>
                  </Link>

                  {event.website && (
                    <a href={event.website} target="_blank" rel="noopener noreferrer">
                      <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium flex items-center">
                        Official Site
                        <ExternalLink className="ml-1.5 h-3 w-3" />
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
