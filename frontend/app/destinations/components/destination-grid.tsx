"use client"

import { DestinationCard } from "./destination-card"
import { Button } from "@/components/ui/button"

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

interface DestinationGridProps {
  destinations: Destination[]
}

export function DestinationGrid({ destinations }: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h3 className="text-xl font-bold mb-2">No destinations found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <div key={destination.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
            <DestinationCard destination={destination} />
          </div>
        ))}
      </div>

      {destinations.length > 6 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <span className="sr-only">Previous page</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 bg-primary text-white border-primary">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              3
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <span className="sr-only">Next page</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </nav>
        </div>
      )}
    </div>
  )
}
