import { Container } from "@/components/container"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Container>
          <div className="py-8 space-y-12">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Blog</h1>
              <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Hero Section Skeleton */}
            <div className="w-full h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>

            {/* Search Filter Skeleton */}
            <div className="w-full h-16 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Featured Posts Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="w-full h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>

            {/* Latest Posts Skeleton */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-full h-[350px] bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
