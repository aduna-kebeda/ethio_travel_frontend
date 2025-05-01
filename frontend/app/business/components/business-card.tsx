import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Globe, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BusinessData } from "@/app/actions/business-actions"

interface BusinessCardProps {
  business: BusinessData
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={business.image || "/placeholder.svg?height=300&width=500"}
          alt={business.businessName}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
          <Star className="h-4 w-4 text-amber-400 mr-1" fill="currentColor" />
          <span className="text-sm font-bold">{business.rating || "New"}</span>
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-2.5 py-1">
            {business.businessType}
          </Badge>

          {business.verified && (
            <Badge variant="outline" className="bg-white text-primary border-primary flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-primary transition-colors">
          {business.businessName}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-700">
              {business.city}, {business.region}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <a href={`tel:${business.phone}`} className="text-gray-700 hover:text-primary transition-colors">
              {business.phone}
            </a>
          </div>
          {business.website && (
            <div className="flex items-center text-sm">
              <Globe className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <a
                href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors truncate"
              >
                {business.website}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 mt-auto">
        <Link href={`/business/${business.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">View Details</Button>
        </Link>
      </div>
    </div>
  )
}
