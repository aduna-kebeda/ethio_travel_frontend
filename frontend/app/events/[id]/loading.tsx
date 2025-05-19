import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image skeleton */}
            <Skeleton className="w-full h-[400px] rounded-lg" />

            {/* Description skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div>
            <Skeleton className="w-full h-[500px] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
