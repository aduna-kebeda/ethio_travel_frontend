"use server"

import { cookies } from "next/headers"

// Review types
export interface ReviewData {
  id: number
  business: number
  user: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
  }
  rating: number
  comment: string
  helpful_votes: number
  is_reported: boolean
  created_at: string
  updated_at: string
}

// Function to get reviews for a business
export async function getBusinessReviews(
  businessId: string,
): Promise<{ success: boolean; data?: ReviewData[]; error?: string }> {
  try {
    const accessToken = cookies().get("access_token")?.value

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `https://ai-driven-travel.onrender.com/api/business/businesses/${businessId}/reviews/`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      },
    )

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      // Try to parse error as JSON, but handle case where it's not JSON
      try {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.detail || errorData.message || `Failed to fetch reviews: ${response.status}`,
        }
      } catch (parseError) {
        // If we can't parse as JSON, return the status text
        return {
          success: false,
          error: `Failed to fetch reviews: ${response.status} ${response.statusText}`,
        }
      }
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        error: `Expected JSON but got ${contentType}`,
      }
    }

    // For successful responses, try to parse as JSON with fallback
    try {
      const data = await response.json()
      return { success: true, data: data.results || data }
    } catch (parseError) {
      return {
        success: false,
        error: "Failed to parse response as JSON",
      }
    }
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Function to submit a review
export async function submitReview(
  businessId: string,
  reviewData: { rating: number; comment: string },
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const accessToken = cookies().get("access_token")?.value

    if (!accessToken) {
      return { success: false, error: "Authentication required" }
    }

    const response = await fetch(
      `https://ai-driven-travel.onrender.com/api/business/businesses/${businessId}/reviews/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reviewData),
      },
    )

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      // Try to parse error as JSON, but handle case where it's not JSON
      try {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.detail || errorData.message || `Failed to submit review: ${response.status}`,
        }
      } catch (parseError) {
        // If we can't parse as JSON, return the status text
        return {
          success: false,
          error: `Failed to submit review: ${response.status} ${response.statusText}`,
        }
      }
    }

    // For successful responses, try to parse as JSON with fallback
    try {
      const data = await response.json()
      return { success: true, data }
    } catch (parseError) {
      // If successful response isn't JSON, still return success
      return { success: true }
    }
  } catch (error) {
    console.error("Error submitting review:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
