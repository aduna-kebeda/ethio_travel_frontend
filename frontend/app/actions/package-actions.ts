"use server"

import { cookies } from "next/headers"

// Package types
export interface PackageData {
  id: number
  organizer: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
  }
  title: string
  slug: string
  category: string[]
  location: string
  region: string
  price: string
  discounted_price: string
  duration: string
  duration_in_days: number
  image: string
  gallery_images: string[]
  rating: string
  featured: boolean
  status: string
  description: string
  short_description: string
  included: string[]
  not_included: string[]
  itinerary: string[]
  departure: string
  departure_time: string
  return_time: string
  max_group_size: number
  min_age: number
  difficulty: string
  tour_guide: string
  languages: string[]
  coordinates: number[]
  reviews?: ReviewData[]
  departures?: DepartureData[]
}

export interface ReviewData {
  id: number
  package: number
  user: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
  }
  rating: string
  comment: string
  helpful: boolean
  reported: boolean
  created_at: string
  updated_at: string
}

export interface DepartureData {
  id: number
  package: number
  start_date: string
  end_date: string
  price: string
  available_slots: number
  is_guaranteed: boolean
  created_at: string
  updated_at: string
}

interface GetPackagesParams {
  category?: string
  region?: string
  query?: string
  price_min?: number
  price_max?: number
  duration_min?: number
  duration_max?: number
  featured?: boolean
}

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value || null
}

// Helper function to build headers
async function buildHeaders(requireAuth = false): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  const token = await getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  } else if (requireAuth) {
    throw new Error("Authentication required: No access token found")
  } else {
    console.warn("No access token found, making unauthenticated request")
  }
  return headers
}

export async function getPackages(params: GetPackagesParams = {}): Promise<PackageData[]> {
  try {
    const headers = await buildHeaders()
    const queryParams = new URLSearchParams()

    if (params.category) queryParams.append("category", params.category)
    if (params.region) queryParams.append("region", params.region)
    if (params.query) queryParams.append("search", params.query)
    if (params.price_min) queryParams.append("price_min", params.price_min.toString())
    if (params.price_max) queryParams.append("price_max", params.price_max.toString())
    if (params.duration_min) queryParams.append("duration_min", params.duration_min.toString())
    if (params.duration_max) queryParams.append("duration_max", params.duration_max.toString())
    if (params.featured !== undefined) queryParams.append("featured", params.featured.toString())

    const response = await fetch(
      `https://ai-driven-travel.onrender.com/api/packages/packages/?${queryParams.toString()}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch packages: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error fetching packages:", error)
    return []
  }
}

export async function getPackageById(id: string): Promise<PackageData | null> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/packages/packages/${id}/`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch package: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching package by ID:", error)
    return null
  }
}

export async function getPackageReviews(id: string): Promise<ReviewData[]> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/packages/packages/${id}/reviews/`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch package reviews: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching package reviews:", error)
    return []
  }
}

export async function submitPackageReview(
  packageId: string,
  reviewData: { rating: number; comment: string },
): Promise<{ success: boolean; data?: ReviewData; error?: string }> {
  try {
    const headers = await buildHeaders(true)
    const response = await fetch(
      `https://ai-driven-travel.onrender.com/api/packages/packages/${packageId}/add_review/`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          package: Number(packageId),
          rating: reviewData.rating.toString(),
          comment: reviewData.comment,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.detail || errorData.message || `Failed to submit review: ${response.status}`,
      }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error submitting package review:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getPackageCategories(): Promise<string[]> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/packages/packages/categories/`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch package categories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching package categories:", error)
    return ["Safari", "Nature", "Cultural", "Historical", "Adventure"]
  }
}

export async function getPackageRegions(): Promise<string[]> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/packages/packages/regions/`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch package regions: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching package regions:", error)
    return ["Ethiopia", "Tanzania", "Kenya"]
  }
}
