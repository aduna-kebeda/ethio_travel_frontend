import type React from "react"
import EventCard from "./event-card"

interface Event {
  id: number
  title: string
  description: string
  category: string
  location: string
  start_date: string
  images: string
  price: string
  capacity: number
  current_attendees: number
  featured: boolean
}

interface EventGridProps {
  events: Event[]
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No events found. Please try different filters.</h3>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default EventGrid
