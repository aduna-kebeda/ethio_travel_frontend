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
    const fullAddress = `${address}, ${location}`
    const encodedAddress = encodeURIComponent(fullAddress)
    const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&q=${encodedAddress}`
    setMapUrl(url)
    setIsLoading(false)
  }, [address, location])

  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />
  }

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
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