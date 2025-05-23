"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface MapComponentProps {
  address: string
  location: string
}

const MapComponent = ({ address, location }: MapComponentProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [mapUrl, setMapUrl] = useState("")

  useEffect(() => {
    const loadMap = async () => {
      try {
        setIsLoading(true)
        // Use the full address including location and Ethiopia
        const fullAddress = `${address}, ${location}, Ethiopia`
        const encodedAddress = encodeURIComponent(fullAddress)
        
        // Use a simple Google Maps embed URL with just the address
        const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&zoom=15`
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
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export default MapComponent 