"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Container } from "@/components/container"
import { HeroSection } from "./components/hero-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getBusinesses } from "@/app/actions/business-actions"
import { BusinessData } from "@/app/actions/business-actions"

export default function BusinessDirectoryPage() {
  const router = useRouter()
  const [queryParams, setQueryParams] = useState({
    category: "",
    region: "",
    query: "",
    page: "1",
  })
  const [businesses, setBusinesses] = useState<BusinessData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setQueryParams({
      category: searchParams.get("category") || "",
      region: searchParams.get("region") || "",
      query: searchParams.get("query") || "",
      page: searchParams.get("page") || "1",
    })
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getBusinesses({
          category: queryParams.category,
          region: queryParams.region,
          query: queryParams.query,
        })
        setBusinesses(result)
        console.log("Fetched businesses:", result)
      } catch (err) {
        console.error("Error fetching businesses:", err)
        setError("Failed to load businesses. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [queryParams.category, queryParams.region, queryParams.query])

  const page = parseInt(queryParams.page) || 1
  const itemsPerPage = 6
  const totalPages = Math.ceil(businesses.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage)

  if (isLoading) {
    return (
      <Container className="py-8 text-center">
        <p>Loading businesses...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.refresh()} className="mt-4">
          Retry
        </Button>
      </Container>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />

        <Container className="py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Ethiopian Business Directory</h2>
            <Link href="/business/register">
              <Button className="bg-primary rounded-full hover:bg-primary/90">Register Your Business</Button>
            </Link>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-full shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">No businesses found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBusinesses.map((business) => (
                  <Card key={business.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={typeof business.mainImage === "string" ? business.mainImage : business.mainImage instanceof File ? URL.createObjectURL(business.mainImage) : "/placeholder.svg?height=300&width=500&text=No+Image"}
                        alt={business.businessName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=300&width=500&text=Image+Not+Found"
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
                        <Star className="h-4 w-4 text-primary mr-1" fill="currentColor" />
                        <span className="text-sm font-bold">{business.rating || "N/A"}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-2.5 py-1">
                          {business.businessType}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{business.businessName}</h3>
                        {business.verified && (
                          <Badge
                            variant="outline"
                            className="bg-white text-primary border-primary flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">
                            {business.city}, {business.region}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a
                            href={`tel:${business.phone}`}
                            className="text-gray-700 hover:text-amber-600 transition-colors"
                          >
                            {business.phone || "N/A"}
                          </a>
                        </div>
                      </div>

                      <Link href={`/business/${business.id}`}>
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-1">
                    <Button variant="outline" size="icon" disabled={page === 1} asChild>
                      <Link href={`/business?page=${page - 1}&category=${queryParams.category}&region=${queryParams.region}&query=${queryParams.query}`}>
                        <span className="sr-only">Previous page</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        className={pageNum === page ? "bg-primary hover:bg-primary/90" : ""}
                        asChild
                      >
                        <Link href={`/business?page=${pageNum}&category=${queryParams.category}&region=${queryParams.region}&query=${queryParams.query}`}>
                          {pageNum}
                        </Link>
                      </Button>
                    ))}

                    <Button variant="outline" size="icon" disabled={page === totalPages} asChild>
                      <Link href={`/business?page=${page + 1}&category=${queryParams.category}&region=${queryParams.region}&query=${queryParams.query}`}>
                        <span className="sr-only">Next page</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  )
}