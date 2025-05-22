"use client"

import type React from "react"
import { use } from "react"
import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getDestinationById,
  getDestinationReviews,
  submitDestinationReview,
  type DestinationDetails,
  type ReviewData,
} from "@/app/actions/destination-actions"
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Camera,
  Map,
  Info,
  ThumbsUp,
  Flag,
  Clock,
  Utensils,
  Wifi,
  DollarSign,
  Languages,
  AlertTriangle,
  Compass,
  Sun,
  Cloud,
  Umbrella,
} from "lucide-react"
import MapComponent from "../components/map-component"
import { WeatherComponent } from "../components/weather-component"

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [destination, setDestination] = useState<DestinationDetails | null>(null)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [sortBy, setSortBy] = useState<"rating" | "helpful" | "created_at">("created_at")
  const { toast } = useToast()

  // Fetch destination data
  useEffect(() => {
    async function fetchDestinationData() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getDestinationById(resolvedParams.id)

        if (result.success && result.data) {
          setDestination(result.data)

          // Fetch reviews separately with sorting
          const reviewsResult = await getDestinationReviews(resolvedParams.id, sortBy)
          if (reviewsResult.success && reviewsResult.data) {
            setReviews(reviewsResult.data)
          }
        } else {
          setError(result.error || "Failed to load destination details")
          toast({
            title: "Error",
            description: result.error || "Failed to load destination details",
            variant: "destructive",
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinationData()
  }, [resolvedParams.id, toast, sortBy])

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your review",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingReview(true)

    try {
      const result = await submitDestinationReview(resolvedParams.id, {
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
      })

      if (result.success && result.data) {
        toast({
          title: "Review submitted",
          description: "Thank you for sharing your experience!",
        })

        // Add the new review to the list
        setReviews([result.data, ...reviews])

        // Reset form
        setReviewRating(5)
        setReviewTitle("")
        setReviewContent("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow">
          {/* Hero Section Skeleton */}
          <section className="relative h-[500px] bg-gray-200">
            <Skeleton className="w-full h-full" />
          </section>

          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-12 w-full mb-6" />
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </Container>
        </main>
      </div>
    )
  }

  // Error state
  if (error || !destination) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow">
          <Container className="py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Destination</h2>
              <p className="text-red-600 mb-6">{error || "Destination not found"}</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </Container>
        </main>
      </div>
    )
  }

  // Format category and region for display
  const formattedCategory = destination.category.charAt(0).toUpperCase() + destination.category.slice(1)
  const formattedRegion = destination.region.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Get main image and gallery images
  const mainImage =
    destination.images && destination.images.length > 0
      ? destination.images[0]
      : `/placeholder.svg?height=600&width=1200&text=${encodeURIComponent(destination.title)}`

  const galleryImages = [...(destination.images || []), ...(destination.gallery_images || [])].filter(Boolean)

  // Format rating for display
  const formattedRating = Number.parseFloat(destination.rating).toFixed(1).replace(/\.0$/, "")

  // Get current month for best time to visit
  const currentMonth = new Date().getMonth()
  const bestTimeToVisit = getBestTimeToVisit(currentMonth)

  // Helper function to determine best time to visit
  function getBestTimeToVisit(month: number) {
    // Ethiopia has distinct dry and wet seasons
    if (month >= 9 || month <= 2) {
      // October to March (dry season)
      return {
        season: "Dry Season",
        recommendation: "Excellent time to visit",
        description:
          "Clear skies and comfortable temperatures make this an ideal time for sightseeing and outdoor activities.",
        icon: <Sun className="h-6 w-6 text-yellow-500" />,
      }
    } else if (month >= 3 && month <= 5) {
      // April to June (small rainy season)
      return {
        season: "Small Rainy Season",
        recommendation: "Good time to visit",
        description: "Occasional showers but still good for most activities. Landscapes are lush and green.",
        icon: <Cloud className="h-6 w-6 text-blue-400" />,
      }
    } else {
      // July to September (main rainy season)
      return {
        season: "Main Rainy Season",
        recommendation: "Less ideal for visiting",
        description: "Heavy rainfall may affect outdoor activities and some roads may be difficult to access.",
        icon: <Umbrella className="h-6 w-6 text-blue-600" />,
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px]">
          <div className="absolute inset-0">
            <img src={mainImage || "/placeholder.svg"} alt={destination.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
            <div className="max-w-3xl text-white">
              <Badge className="bg-primary mb-4">{formattedCategory}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.title}</h1>
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                  <span className="font-medium">{formattedRating}</span>
                  <span className="text-gray-300 ml-1">({destination.review_count} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>
                    {destination.city}, {formattedRegion}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary/90">Plan Your Visit</Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Heart className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-white rounded-lg p-1">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    
                    <Info className="h-4 w-4 mr-2" /> Overview
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="gallery"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" /> Gallery
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Map className="h-4 w-4 mr-2" /> Location
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <div className="prose max-w-none">
                      <p>{destination.description}</p>
                    </div>
                    
                    {/* Weather Component */}
                    {/* <div className="mt-6">
                      <WeatherComponent address={destination.address} city={destination.city} />
                    </div> */}

                    {/* Local Tips */}
                    <div className="mt-6">
                      <div className="flex items-center mb-2">
                        <Compass className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-semibold">Local Tips</h4>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <Languages className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span>Amharic is the official language, but English is widely spoken in tourist areas</span>
                        </li>
                        <li className="flex items-start">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span>Local currency is Ethiopian Birr (ETB). Cash is preferred in most places</span>
                        </li>
                        <li className="flex items-start">
                          <Utensils className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span>Try traditional Ethiopian coffee ceremony and injera with doro wat</span>
                        </li>
                        <li className="flex items-start">
                          <Wifi className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span>Internet connectivity may be limited in remote areas</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span>Respect local customs and dress modestly when visiting religious sites</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryImages.length > 0 ? (
                        galleryImages.map((image, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${destination.title} ${index + 1}`}
                              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">No gallery images available</div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Location</h2>
                    <MapComponent address={destination.address} location={`${destination.city}, ${formattedRegion}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="font-bold mb-2">Address</h3>
                        <p className="text-gray-600 mb-4">{destination.address}</p>
                        <div className="flex space-x-2">
                          <span className="font-semibold">Coordinates:</span>
                          <span>
                            {destination.latitude}, {destination.longitude}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Region</h3>
                        <p className="text-gray-600 mb-4">
                          {destination.city}, {formattedRegion}
                        </p>
                        <Button variant="outline" className="w-full">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-6">Reviews</h2>

                    {/* Review Form */}
                    <div className="mb-8 border-b pb-8">
                      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium  mb-1">Rating</label>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setReviewRating(star)} className="p-1">
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= reviewRating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-sm ">{reviewRating} out of 5 stars</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="reviewTitle" className="block text-sm font-medium  mb-1">
                            Title
                          </label>
                          <input
                            id="reviewTitle"
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            placeholder="Summarize your experience"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="reviewContent" className="block text-sm font-medium mb-1">
                            Review
                          </label>
                          <textarea
                            id="reviewContent"
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] bg-white"
                            placeholder="Share your experience with this destination"
                            required
                          />
                        </div>

                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmittingReview}>
                          {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </div>

                    {/* Reviews List */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Sort by:</span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "rating" | "helpful" | "created_at")}
                            className="text-sm border rounded-md px-2 py-1 bg-white"
                          >
                            <option value="created_at">Most Recent</option>
                            <option value="rating">Highest Rated</option>
                            <option value="helpful">Most Helpful</option>
                          </select>
                        </div>
                      </div>

                      {reviews.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="">No reviews yet. Be the first to review this destination!</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                              <div className="flex items-start gap-4">
                                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center font-semibold">
                                  {review.user.first_name.charAt(0)}
                                  {review.user.last_name.charAt(0)}
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium">
                                        {review.user.first_name} {review.user.last_name}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className={`h-4 w-4 ${
                                                star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                          {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <h5 className="font-bold mb-2">{review.title}</h5>
                                  <p className="text-gray-700">{review.content}</p>

                                  <div className="flex items-center gap-4 mt-3">
                                    <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                                      <ThumbsUp className="h-4 w-4" /> Helpful ({review.helpful})
                                    </button>
                                    <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                                      <Flag className="h-4 w-4" /> Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Replaced booking section with travel information */}
            <div className="space-y-6">
              {/* Travel Information Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Travel Information</h3>
                <div className="space-y-4">
                  {/* Best Time to Visit */}
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-semibold">Best Time to Visit</h4>
                    </div>
                    <div className="flex items-center mb-2">
                      {bestTimeToVisit.icon}
                      <span className="ml-2 font-medium">
                        {bestTimeToVisit.season} - {bestTimeToVisit.recommendation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{bestTimeToVisit.description}</p>
                  </div>

                  {/* Visiting Hours */}
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-semibold">Visiting Hours</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Weekdays:</p>
                        <p className="text-gray-600">8:00 AM - 5:00 PM</p>
                      </div>
                      <div>
                        <p className="font-medium">Weekends:</p>
                        <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                 
                </div>
              </div>

              {/* Weather Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <WeatherComponent address={destination.address} city={destination.city} />
              </div>

              {/* Nearby Attractions Card - New addition */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Nearby Attractions</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={`/placeholder.svg?height=64&width=64&text=Nearby+${item}`}
                          alt={`Nearby attraction ${item}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Nearby Attraction {item}</h4>
                        <p className="text-xs text-gray-500 mb-1">2.{item} km away</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs ml-1">4.{item}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    View All Nearby
                  </Button>
                </div>
              </div>
            </div>
          </div>

         
        </Container>
      </main>

      <ScrollToTop />
    </div>
  )
}
