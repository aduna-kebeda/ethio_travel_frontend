import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Destination {
  id: number
  name: string
  category: string
  image: string
  description: string
  rating: number
  reviews: number
  location: string
  price: string
  featured?: boolean
}

interface DestinationCardProps {
  destination: Destination
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            {destination.category}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{destination.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{destination.rating}</span>
            <span className="text-xs text-gray-500">({destination.reviews})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{destination.location}</span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-primary font-bold">
            {destination.price}
            <span className="text-gray-500 text-sm font-normal"> /person</span>
          </div>
          <Link href={`/destinations/${destination.id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
