"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface DestinationData {
  id: string
  title: string
  description: string
  category: string
  region: string
  city: string
  address: string
  featured: boolean
  rating: string
  review_count: number
  images: string[]
  gallery_images: string[]
}

interface DestinationCardProps {
  destination: DestinationData
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const [imageError, setImageError] = useState(false)

  // Get the first image or use a placeholder
  const imageUrl =
    destination.images && destination.images.length > 0 && !imageError
      ? destination.images[0]
      : `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(destination.title)}`

  // Format rating to display with one decimal place if needed
  const formattedRating = Number.parseFloat(destination.rating || "0")
    .toFixed(1)
    .replace(/\.0$/, "")

  // Format region name for display
  const formattedRegion = destination.region
    ? destination.region.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : ""

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={destination.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-4 right-4 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
        </div>
        {destination.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-white">Featured</Badge>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-gray-800 border-0">
            {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{destination.title}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{formattedRating}</span>
            <span className="text-xs text-gray-500">({destination.review_count || 0})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {destination.city}
            {formattedRegion && `, ${formattedRegion}`}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-primary font-bold">
            <span className="text-gray-500 text-sm font-normal">Explore</span>
          </div>
          <Link href={`/destinations/${destination.id}`}>
            <Button size="sm" className="bg-primary rounded-full hover:bg-primary/90">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
