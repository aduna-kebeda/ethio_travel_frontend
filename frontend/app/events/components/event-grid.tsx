"use client"

import { useState, useEffect } from "react"
import EventCard from "./event-card"
import { motion } from "framer-motion"

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

const EventGrid = ({ events }: EventGridProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <h3 className="text-xl font-medium text-gray-600">No events found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default EventGrid