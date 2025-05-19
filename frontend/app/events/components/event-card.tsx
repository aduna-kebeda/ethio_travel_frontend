"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface EventCardProps {
  id: string
  title: string
  description: string
  image: string
  date: string
  location: string
  category: string
  attendees: number
  capacity: number
  featured?: boolean
}

export default function EventCard({
  id,
  title,
  description,
  image,
  date,
  location,
  category,
  attendees,
  capacity,
  featured,
}: EventCardProps) {
  const [imageError, setImageError] = useState(false)

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const isFullyBooked = attendees >= capacity
  const imageSrc =
    !imageError && image ? image : `/placeholder.svg?height=225&width=400&text=${encodeURIComponent(title)}`

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <div className="aspect-video relative">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        {featured && <Badge className="absolute top-2 right-2 bg-primary text-white">Featured</Badge>}
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          {isFullyBooked && (
            <Badge variant="secondary" className="text-xs">
              Fully Booked
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>
              {attendees}/{capacity} attendees
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
