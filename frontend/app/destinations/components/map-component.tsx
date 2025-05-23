"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"

interface MapComponentProps {
  address: string
  location: string
}

export default function MapComponent({ address, location }: MapComponentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [mapUrl, setMapUrl] = useState("")

  useEffect(() => {
    const loadMap = async () => {
      try {
        setIsLoading(true)
        // Format the address with proper spacing and commas
        const formattedAddress = address.trim()
        const formattedLocation = location.trim()
        const fullAddress = `${formattedAddress}, ${formattedLocation}, Ethiopia`
        const encodedAddress = encodeURIComponent(fullAddress)
        
        // Use the same URL format as events map that works without API key
        const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=m&z=15&output=embed`
        setMapUrl(mapUrl)
      } catch (error) {
        console.error("Error loading map:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMap()
  }, [address, location])

  if (isLoading) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          title="Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className="absolute inset-0"
          loading="lazy"
        />
      </div>
      <div className="flex items-center text-gray-700">
        <MapPin className="h-5 w-5 text-primary mr-2" />
        <span>{address}, {location}, Ethiopia</span>
      </div>
    </div>
  )
}
