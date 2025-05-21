"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface EventCardProps {
  event: {
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
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    id,
    title,
    description,
    category,
    location,
    start_date,
    images,
    price,
    capacity,
    current_attendees,
    featured,
  } = event

  // Truncate description to 100 characters
  const truncatedDescription = description.length > 100 ? `${description.substring(0, 100)}...` : description

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image src={images || "/placeholder.svg?height=400&width=600"} alt={title} fill className="object-cover" />
        {featured && <Badge className="absolute top-2 right-2 bg-primary text-white">Featured</Badge>}
        <Badge
          className="absolute top-2 left-2"
          variant="outline"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      </div>
      <CardContent className="flex-grow pt-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatDate(start_date)}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{truncatedDescription}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {current_attendees}/{capacity}
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center font-medium mr-4">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>${Number.parseFloat(price).toFixed(2)}</span>
          </div>
          <Link
            href={`/events/${id}`}
            className="text-sm font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Detail
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default EventCard