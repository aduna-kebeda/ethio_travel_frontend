"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DestinationCard } from "@/app/destinations/components/destination-card"
import { getDestinations, type DestinationData } from "@/app/actions/destination-actions"
import { useToast } from "@/hooks/use-toast"

export function PopularDestinations() {
  const [destinations, setDestinations] = useState<DestinationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDestinations() {
      setIsLoading(true)
      setError(null)

      try {
        // Get featured destinations
        const result = await getDestinations(undefined, undefined, true)

        if (result.success && result.data) {
          setDestinations(result.data.slice(0, 4)) // Limit to 4 destinations
        } else {
          setError(result.error || "Failed to load destinations")
          console.error("Failed to load destinations:", result.error)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        console.error("Error fetching destinations:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [toast])

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover Ethiopia's most beloved destinations, from ancient historical sites to breathtaking natural wonders
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <Skeleton className="h-64 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Destinations</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        ) : destinations.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Destinations</h3>
            <p className="text-gray-600 mb-4">Check back later for our featured destinations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href="/destinations">View All Destinations</a>
          </Button>
        </div>
      </Container>
    </section>
  )
}
