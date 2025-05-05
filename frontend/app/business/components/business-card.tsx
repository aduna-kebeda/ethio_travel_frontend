"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BusinessCardProps {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  category: string
  imageUrl?: string
  rating?: number
  reviewCount?: number
  verified?: boolean
  featured?: boolean
  className?: string
}

export default function BusinessCard({
  id,
  name,
  description,
  address,
  city,
  state,
  category,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  verified = false,
  featured = false,
  className = "",
}: BusinessCardProps) {
  // Truncate description for preview
  const truncatedDescription = description.length > 120 ? `${description.substring(0, 120)}...` : description

  // Handle missing image URL
  const safeImageUrl = imageUrl || "/placeholder.svg?height=300&width=500"

  // Format full address
  const fullAddress = `${address}, ${city}, ${state}`

  // Format rating display
  const displayRating = rating.toFixed(1)

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${featured ? "border-primary/20" : ""} ${className}`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Link href={`/business/${id}`}>
          <Image
            src={safeImageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured}
          />
        </Link>
        {verified && <Badge className="absolute top-4 right-4 bg-green-600 hover:bg-green-700">Verified</Badge>}
        {!verified && <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600">Pending</Badge>}
        <Badge className="absolute top-4 left-4 bg-primary hover:bg-primary/90">{category}</Badge>
      </div>

      <CardHeader className="p-4 pb-2">
        <Link href={`/business/${id}`} className="hover:underline">
          <h3 className="text-xl font-semibold line-clamp-1">{name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium">{displayRating}</span>
          <span className="text-muted-foreground text-sm">({reviewCount} reviews)</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground line-clamp-3 mb-3">{truncatedDescription}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{fullAddress}</span>
          </div>

          <div className="flex items-center gap-2">
            {verified ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Verified Business</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-500 font-medium">Verification Pending</span>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/business/${id}`}>View Details</Link>
        </Button>

        <Button variant="default" size="sm" asChild>
          <Link href={`/business/${id}#reviews`}>Write Review</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
