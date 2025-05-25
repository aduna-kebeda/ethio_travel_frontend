"use server"

import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-driven-travel.onrender.com/api"

// Helper function to get the auth token
const getAuthToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

// Interface for destination data
export interface DestinationData {
  id: string
  title: string
  slug: string
  description: string
  category: string
  region: string
  city: string
  address: string
  latitude: string
  longitude: string
  featured: boolean
  status: string
  rating: string
  review_count: number
  images: string[]
  gallery_images: string[]
  created_at: string
  updated_at: string
}

// Interface for destination details with reviews
export interface DestinationDetails extends DestinationData {
  reviews: ReviewData[]
}

// Interface for review data
export interface ReviewData {
  id: string
  destination: string
  user: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    role: string
    status: string
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
    email_verified: boolean
  }
  rating: number
  title: string
  content: string
  helpful: number
  reported: boolean
  created_at: string
  updated_at: string
}

// Interface for pagination response
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Get all destinations
export async function getDestinations(
  category?: string,
  region?: string,
  featured?: boolean,
): Promise<{ success: boolean; data?: DestinationData[]; error?: string }> {
  try {
    const token = await getAuthToken()

    let url = `${API_URL}/destinations/destinations/`
    const params = new URLSearchParams()

    if (category) params.append("category", category)
    if (region) params.append("region", region)
    if (featured !== undefined) params.append("featured", featured.toString())

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching destinations: ${response.status}`)
    }

    const data: PaginatedResponse<DestinationData> = await response.json()
    return { success: true, data: data.results }
  } catch (error) {
    console.error("Failed to fetch destinations:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}

// Get a single destination by ID
export async function getDestinationById(
  id: string,
): Promise<{ success: boolean; data?: DestinationDetails; error?: string }> {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/destinations/destinations/${id}/`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching destination: ${response.status}`)
    }

    const data: DestinationDetails = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`Failed to fetch destination with ID ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}

// Get reviews for a destination
export async function getDestinationReviews(
  destinationId: string,
  sortBy?: string,
): Promise<{ success: boolean; data?: ReviewData[]; error?: string }> {
  try {
    const token = await getAuthToken()

    let url = `${API_URL}/destinations/destinations/${destinationId}/reviews/`
    if (sortBy) {
      url += `?sort_by=${sortBy}`
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.status}`)
    }

    const data: ReviewData[] = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`Failed to fetch reviews for destination ${destinationId}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}

// Submit a review for a destination
export async function submitDestinationReview(
  destinationId: string,
  reviewData: { rating: number; title: string; content: string },
): Promise<{ success: boolean; data?: ReviewData; error?: string }> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return { success: false, error: "Authentication required to submit a review" }
    }

    const response = await fetch(`${API_URL}/destinations/destinations/${destinationId}/add_review/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        destination: destinationId,
        user: {}, // API expects this field
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 400 && errorData.error === "You have already reviewed this destination") {
        return { success: false, error: "You have already reviewed this destination" }
      }
      throw new Error(errorData.error || `Error submitting review: ${response.status}`)
    }

    const data: ReviewData = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`Failed to submit review for destination ${destinationId}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}

// Mark a review as helpful
export async function markReviewAsHelpful(reviewId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken()

    if (!token) {
      return { success: false, error: "Authentication required" }
    }

    const response = await fetch(`${API_URL}/destinations/reviews/${reviewId}/mark_helpful/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error marking review as helpful: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Failed to mark review ${reviewId} as helpful:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}

// Report a review
export async function reportReview(reviewId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken()

    if (!token) {
      return { success: false, error: "Authentication required" }
    }

    const response = await fetch(`${API_URL}/destinations/reviews/${reviewId}/report/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error reporting review: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Failed to report review ${reviewId}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}
