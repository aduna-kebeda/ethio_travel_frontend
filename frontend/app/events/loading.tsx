import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section skeleton */}
      <div className="w-full h-[400px] rounded-lg mb-8">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Filters skeleton */}
      <div className="w-full rounded-lg mb-8">
        <Skeleton className="w-full h-16" />
      </div>

      {/* Events grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-full h-16" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="w-1/4 h-4" />
                  <Skeleton className="w-1/4 h-4" />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Calendar skeleton */}
      <div className="w-full rounded-lg">
        <Skeleton className="w-full h-[400px]" />
      </div>
    </div>
  )
}
