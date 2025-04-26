import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Wifi,
} from "lucide-react"
import { getBusinessById } from "@/app/actions/business-actions"
import { notFound } from "next/navigation"

interface BusinessDetailPageProps {
  params: {
    id: string
  }
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  // Get business data
  const business = await getBusinessById(params.id)

  if (!business) {
    notFound()
  }

  // Format facilities as an array
  const facilitiesList = business?.facilities ? business.facilities.split(",").map((item: string) => item.trim()) : []

  // Mock gallery images
  const galleryImages = [
    `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName)}+1`,
    `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName)}+2`,
    `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName)}+3`,
    `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName)}+4`,
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={business?.image || "/placeholder.svg"}
            alt={business?.businessName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Container className="relative h-full flex flex-col justify-end pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-primary hover:bg-primary/90">{business?.businessType}</Badge>
              {business?.verified && (
                <Badge variant="secondary" className="bg-white text-primary flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified</span>
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{business?.businessName}</h1>
            <div className="flex items-center text-white mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{business?.address}</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-white/70" />
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                <span>{business?.rating || "New"}</span>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-3">Description</h2>
                    <p className="text-gray-700">{business?.description}</p>
                  </div>

                  {facilitiesList.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-3">Facilities & Amenities</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {facilitiesList.map((facility: string) => (
                          <div key={facility} className="flex items-center">
                            <Wifi className="h-4 w-4 text-primary mr-2" />
                            <span className="text-gray-700">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {business?.openingHours && (
                    <div>
                      <h2 className="text-xl font-bold mb-3">Opening Hours</h2>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <span>{business?.openingHours}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  <h2 className="text-xl font-bold mb-3">Photo Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${business?.businessName} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <h2 className="text-xl font-bold mb-3">Location</h2>
                  <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Map will be displayed here</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span>
                      {business?.address}, {business?.city}, {business?.region}
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Reviews & Ratings</h2>
                    <Button className="bg-primary hover:bg-primary/90">Write a Review</Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to review this business</p>
                    <Button className="bg-primary hover:bg-primary/90">Write a Review</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Contact Information</h2>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <a href={`tel:${business?.phone}`} className="text-gray-700 hover:text-primary">
                        {business?.phone}
                      </a>
                    </div>

                    {business?.email && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-primary mr-3" />
                        <a href={`mailto:${business?.email}`} className="text-gray-700 hover:text-primary">
                          {business?.email}
                        </a>
                      </div>
                    )}

                    {business?.website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-primary mr-3" />
                        <a
                          href={
                            business?.website.startsWith("http") ? business?.website : `https://${business?.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-primary"
                        >
                          {business?.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Social Media</h3>
                    <div className="flex gap-2">
                      {business?.facebook && (
                        <a
                          href={
                            business?.facebook.startsWith("http") ? business?.facebook : `https://${business?.facebook}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Facebook className="h-5 w-5 text-blue-600" />
                        </a>
                      )}

                      {business?.instagram && (
                        <a
                          href={
                            business?.instagram.startsWith("http")
                              ? business?.instagram
                              : `https://${business?.instagram}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Instagram className="h-5 w-5 text-pink-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Business Details</h2>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">{business?.businessType}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">
                        {business?.city}, {business?.region}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">Listed since {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button className="w-full bg-primary hover:bg-primary/90">Contact Business</Button>

                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>

                    <div className="text-center mt-2">
                      <Link href="/business/claim" className="text-sm text-primary hover:underline">
                        Is this your business? Claim it now
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold text-primary mb-2">Advertise with us</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Boost your visibility and reach more customers by promoting your business.
                </p>
                <Link href="/business/advertise">
                  <Button className="w-full bg-primary hover:bg-primary/90">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
