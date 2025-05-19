import { DestinationCard } from "./destination-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DestinationData } from "@/app/actions/destination-actions"

interface DestinationGridProps {
  destinations: DestinationData[]
  isLoading?: boolean
  error?: string
}

export function DestinationGrid({ destinations, isLoading, error }: DestinationGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
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
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Destinations</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  // Empty state
  if (!destinations || destinations.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Destinations Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
      </div>
    )
  }

  // Destinations grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  )
}
