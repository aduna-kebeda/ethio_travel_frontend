import { Container } from "@/components/container"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BusinessDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="relative h-64 md:h-96 w-full bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Container className="relative h-full flex flex-col justify-end pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </Container>
        </div>

        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-full mb-6" />
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-8 w-40 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div>
                  <Skeleton className="h-8 w-64 mb-3" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
