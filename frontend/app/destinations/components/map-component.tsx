"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface MapComponentProps {
  address: string
  location: string
}

export default function MapComponent({ address, location }: MapComponentProps) {
  const [mapUrl, setMapUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMap = async () => {
      try {
        setIsLoading(true)
        // Combine address and location for better accuracy
        const fullAddress = `${address}, ${location}, Ethiopia`
        const encodedAddress = encodeURIComponent(fullAddress)
        
        // Use direct Google Maps embed URL
        const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5205105887855!2d38.7639!3d9.0320!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDEnNTIuMCJOIDM4wrA0NSc1MC4wIkU!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set&q=${encodedAddress}`
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
