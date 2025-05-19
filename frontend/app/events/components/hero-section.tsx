import type React from "react"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
  id: number
  title: string
  description: string
  location: string
  start_date: string
  images: string
}

interface HeroSectionProps {
  featuredEvent?: Event
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredEvent }) => {
  if (!featuredEvent) {
    return (
      <div className="relative bg-gradient-to-r from-primary/90 to-primary h-[400px] flex items-center">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Amazing Events</h1>
            <p className="text-white/90 text-lg mb-6">
              Find and join exciting events happening around you. From cultural experiences to music festivals, there's
              something for everyone.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/events">Browse All Events</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative h-[500px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${
          featuredEvent.images || "/placeholder.svg?height=500&width=1200"
        })`,
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <span className="inline-block bg-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Featured Event
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{featuredEvent.title}</h1>
          <p className="text-white/90 text-lg mb-6">
            {featuredEvent.description.length > 150
              ? `${featuredEvent.description.substring(0, 150)}...`
              : featuredEvent.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>
                {new Date(featuredEvent.start_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{featuredEvent.location}</span>
            </div>
          </div>
          <Button asChild size="lg">
            <Link href={`/events/${featuredEvent.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
