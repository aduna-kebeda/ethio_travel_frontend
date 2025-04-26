import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Event } from "../types"

interface UpcomingEventsProps {
  events: Event[]
}

export const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (events.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white rounded-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <p className="text-gray-500 mt-1">Don't miss these upcoming celebrations</p>
          </div>
          <Link
            href="/events/upcoming"
            className="text-[#E91E63] hover:underline text-sm font-medium flex items-center"
          >
            View all upcoming
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#E91E63] hover:bg-[#E91E63]">{event.category}</Badge>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-3 group-hover:text-[#E91E63] transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-[#E91E63]" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-[#E91E63]" />
                      <span className="text-sm line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
