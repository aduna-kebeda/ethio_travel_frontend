"use client"

import { Container } from "@/components/container"
import { HeroSection } from "./components/hero-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BusinessPageProps {
  searchParams: {
    category?: string
    region?: string
    query?: string
    page?: string
  }
}

export default async function BusinessDirectoryPage({ searchParams }: BusinessPageProps) {
  // Mock data for businesses
  const businesses = [
    {
      id: "1",
      businessName: "Sheraton Addis",
      businessType: "Hotel",
      description: "Luxury hotel in the heart of Addis Ababa with world-class restaurants and a spa.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Taitu Street, Addis Ababa",
      phone: "+251 11 517 1717",
      email: "info@sheratonaddis.com",
      website: "www.sheratonaddis.com",
      verified: true,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
    },
    {
      id: "2",
      businessName: "Yod Abyssinia Cultural Restaurant",
      businessType: "Restaurant",
      description: "Traditional Ethiopian restaurant with cultural performances and authentic cuisine.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Bole Road, Addis Ababa",
      phone: "+251 11 661 2985",
      email: "info@yodethiopia.com",
      website: "www.yodethiopia.com",
      verified: true,
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
    },
    {
      id: "3",
      businessName: "Ethiopia Travel Agency",
      businessType: "Travel Agency",
      description: "Full-service tour operator specializing in cultural and historical tours of Ethiopia.",
      region: "Amhara",
      city: "Bahir Dar",
      address: "Main Street, Bahir Dar",
      phone: "+251 91 123 4567",
      email: "info@ethiopiatravel.com",
      website: "www.ethiopiatravel.com",
      verified: false,
      rating: 4.2,
      image: "/placeholder.svg?height=300&width=500&text=Ethiopia+Travel",
    },
    {
      id: "4",
      businessName: "Kuriftu Resort & Spa",
      businessType: "Resort",
      description: "Luxury resort with stunning views of Lake Tana and excellent amenities.",
      region: "Amhara",
      city: "Bahir Dar",
      address: "Lake Tana, Bahir Dar",
      phone: "+251 11 662 6666",
      email: "reservations@kuriftu.com",
      website: "www.kuriftu.com",
      verified: true,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=500&text=Kuriftu+Resort",
    },
    {
      id: "5",
      businessName: "Lalibela Tours",
      businessType: "Tour Guide",
      description: "Expert guides for the rock-hewn churches of Lalibela and surrounding areas.",
      region: "Amhara",
      city: "Lalibela",
      address: "Church Square, Lalibela",
      phone: "+251 91 987 6543",
      email: "info@lalibelatours.com",
      website: "www.lalibelatours.com",
      verified: true,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=500&text=Lalibela+Tours",
    },
    {
      id: "6",
      businessName: "Axum Souvenir Shop",
      businessType: "Souvenir Shop",
      description: "Authentic Ethiopian crafts, jewelry, and souvenirs from the historic city of Axum.",
      region: "Tigray",
      city: "Axum",
      address: "Stelae Field Road, Axum",
      phone: "+251 91 456 7890",
      email: "shop@axumsouvenirs.com",
      website: "www.axumsouvenirs.com",
      verified: false,
      rating: 4.0,
      image: "/placeholder.svg?height=300&width=500&text=Axum+Souvenirs",
    },
  ]

  // Filter businesses based on search parameters
  const filteredBusinesses = businesses.filter((business) => {
    const matchesCategory = !searchParams.category || business.businessType === searchParams.category
    const matchesRegion = !searchParams.region || business.region === searchParams.region
    const matchesQuery =
      !searchParams.query ||
      business.businessName.toLowerCase().includes(searchParams.query.toLowerCase()) ||
      business.description.toLowerCase().includes(searchParams.query.toLowerCase())

    return matchesCategory && matchesRegion && matchesQuery
  })

  // Pagination
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />

        <Container className="py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Ethiopian Business Directory</h2>
            <Link href="/business/register">
              <Button className="bg-primary hover:bg-primary/90">Register Your Business</Button>
            </Link>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
                        src={business.image || "/placeholder.svg"}
                        alt={business.businessName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
                        <Star className="h-4 w-4 text-primary mr-1" fill="currentColor" />
                        <span className="text-sm font-bold">{business.rating}</span>
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
                            {business.phone}
                          </a>
                        </div>
                      </div>

                      <Link href={`/business/${business.id}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">
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
                    <Button variant="outline" size="icon" onClick={() => {}} disabled={page === 1} asChild>
                      <Link href={`/business?page=${page - 1}`}>
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
                        <Link href={`/business?page=${pageNum}`}>{pageNum}</Link>
                      </Button>
                    ))}

                    <Button variant="outline" size="icon" onClick={() => {}} disabled={page === totalPages} asChild>
                      <Link href={`/business?page=${page + 1}`}>
                        <span className="sr-only">Next page</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
