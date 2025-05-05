"use server"

import { cookies } from "next/headers"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dpasgcaqm",
  api_key: process.env.CLOUDINARY_API_KEY || "296661259151749",
  api_secret: process.env.CLOUDINARY_API_SECRET || "O39mS4BgA_5bN2miMuaRI3YTfR0",
  secure: true,
})

// Business types
export interface BusinessData {
  id: string | number
  businessName: string
  businessType: string
  description: string
  region: string
  city: string
  address: string
  phone?: string
  email?: string
  website?: string
  verified?: boolean
  rating?: number
  mainImage?: string | File // Allow File for uploads
  openingHours?: string
  facilities?: string
  facebook?: string
  instagram?: string
  galleryImages?: string | File[] // Allow File[] for uploads
  totalReviews?: number
  createdAt?: string
  status?: string
  latitude?: string
  longitude?: string
  services?: string
  team?: string
  socialMediaLinks?: string
}

interface GetBusinessesParams {
  category?: string
  region?: string
  city?: string
  query?: string
}

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value || null
}

// Helper function to validate Cloudinary URL
function validateCloudinaryUrl(url: string): boolean {
  return (
    url === "" ||
    url.startsWith(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || "dpasgcaqm"}/`) ||
    url.startsWith("https://example.com/")
  )
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

// Helper function to upload business images to Cloudinary
async function uploadBusinessImageToCloudinary(file: File): Promise<string> {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique public ID
    const publicId = `businesses/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    // Upload to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "businesses",
          public_id: publicId,
          resource_type: "image",
          transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      uploadStream.end(buffer)
    })

    if (!result.secure_url) {
      throw new Error("Failed to retrieve secure URL from Cloudinary")
    }

    // Verify image accessibility
    const verifyResponse = await fetch(result.secure_url)
    if (!verifyResponse.ok) {
      throw new Error(`Uploaded image is not accessible: ${result.secure_url}`)
    }

    console.log("Cloudinary upload result:", { publicId: result.public_id, url: result.secure_url })
    return result.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw new Error("Failed to upload image to Cloudinary")
  }
}

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  const snakeCaseObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      snakeCaseObj[snakeKey] = value
    }
  }
  return snakeCaseObj
}

export async function getBusinesses(params: GetBusinessesParams): Promise<BusinessData[]> {
  try {
    const result = await fetchBusinesses(params)
    if (result.success) {
      return result.data.map((business: any) => ({
        id: business.id,
        businessName: business.name || business.businessName,
        businessType: business.business_type || business.businessType,
        description: business.description,
        region: business.region,
        city: business.city,
        address: business.address,
        phone: business.contact_phone || business.phone,
        email: business.contact_email || business.email,
        website: business.website,
        verified: business.is_verified ?? business.verified,
        rating: business.rating || Number.parseFloat(business.average_rating) || undefined,
        mainImage: business.main_image || business.image || business.mainImage,
        openingHours: business.opening_hours || business.openingHours,
        facilities: business.facilities,
        facebook: business.facebook,
        instagram: business.instagram,
        galleryImages: business.gallery_images || business.galleryImages,
        totalReviews: business.total_reviews || business.totalReviews,
        createdAt: business.created_at || business.createdAt,
        status: business.status,
        latitude: business.latitude,
        longitude: business.longitude,
        services: business.services,
        team: business.team,
        socialMediaLinks: business.social_media_links || business.socialMediaLinks,
      }))
    }
  } catch (error) {
    console.error("Error fetching from API, falling back to mock data:", error)
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  let mockBusinesses: BusinessData[] = [
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
      openingHours: "Open 24 hours",
      facilities: "Pool, Spa, Restaurant, Conference Rooms, Gym",
      facebook: "facebook.com/sheratonaddis",
      instagram: "instagram.com/sheratonaddis",
      status: "active",
      createdAt: "2023-05-15T10:30:00Z",
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
      openingHours: "11:00 AM - 11:00 PM",
      facilities: "Cultural performances, Traditional cuisine",
      facebook: "facebook.com/yodethiopia",
      instagram: "instagram.com/yodethiopia",
      status: "active",
      createdAt: "2023-06-20T14:15:00Z",
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Ethiopia+Travel",
      status: "pending",
      createdAt: "2023-07-05T09:45:00Z",
    },
  ]

  if (params.category) {
    mockBusinesses = mockBusinesses.filter((business) => business.businessType === params.category)
  }

  if (params.region) {
    mockBusinesses = mockBusinesses.filter((business) => business.region === params.region)
  }

  if (params.query) {
    const query = params.query.toLowerCase()
    mockBusinesses = mockBusinesses.filter(
      (business) =>
        business.businessName.toLowerCase().includes(query) || business.description.toLowerCase().includes(query),
    )
  }

  return mockBusinesses
}

export async function getBusinessById(id: string): Promise<BusinessData | null> {
  try {
    const result = await fetchBusinessById(id)
    if (result.success) {
      const business = result.data
      return {
        id: business.id,
        businessName: business.name || business.businessName,
        businessType: business.business_type || business.businessType,
        description: business.description,
        region: business.region,
        city: business.city,
        address: business.address,
        phone: business.contact_phone || business.phone,
        email: business.contact_email || business.email,
        website: business.website,
        verified: business.is_verified ?? business.verified,
        rating: business.rating || Number.parseFloat(business.average_rating) || undefined,
        mainImage: business.main_image || business.image || business.mainImage,
        openingHours: business.opening_hours || business.openingHours,
        facilities: business.facilities,
        facebook: business.facebook,
        instagram: business.instagram,
        galleryImages: business.gallery_images || business.galleryImages,
        totalReviews: business.total_reviews || business.totalReviews,
        createdAt: business.created_at || business.createdAt,
        status: business.status,
        latitude: business.latitude,
        longitude: business.longitude,
        services: business.services,
        team: business.team,
        socialMediaLinks: business.social_media_links || business.socialMediaLinks,
      }
    }
  } catch (error) {
    console.error("Error fetching from API, falling back to mock data:", error)
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockBusinesses: BusinessData[] = [
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
      openingHours: "Open 24 hours",
      facilities: "Pool, Spa, Restaurant, Conference Rooms, Gym",
      facebook: "facebook.com/sheratonaddis",
      instagram: "instagram.com/sheratonaddis",
      status: "active",
      createdAt: "2023-05-15T10:30:00Z",
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
      openingHours: "11:00 AM - 11:00 PM",
      facilities: "Cultural performances, Traditional cuisine",
      facebook: "facebook.com/yodethiopia",
      instagram: "instagram.com/yodethiopia",
      status: "active",
      createdAt: "2023-06-20T14:15:00Z",
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Ethiopia+Travel",
      status: "pending",
      createdAt: "2023-07-05T09:45:00Z",
    },
  ]

  return mockBusinesses.find((business) => business.id.toString() === id) || null
}

export async function deleteBusiness(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const headers = await buildHeaders(true)
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/business/businesses/${id}/`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.detail || errorData.message || `Failed to delete business: ${response.status}`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting business:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getBusinessesByUserId(userId: string): Promise<BusinessData[]> {
  try {
    const headers = await buildHeaders(true)
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/business/user-businesses/`, {
      headers,
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      return (data.results || data).map((business: any) => ({
        id: business.id,
        businessName: business.name || business.businessName,
        businessType: business.business_type || business.businessType,
        description: business.description,
        region: business.region,
        city: business.city,
        address: business.address,
        phone: business.contact_phone || business.phone,
        email: business.contact_email || business.email,
        website: business.website,
        verified: business.is_verified ?? business.verified,
        rating: business.rating || Number.parseFloat(business.average_rating) || undefined,
        mainImage: business.main_image || business.image || business.mainImage,
        openingHours: business.opening_hours || business.openingHours,
        facilities: business.facilities,
        facebook: business.facebook,
        instagram: business.instagram,
        galleryImages: business.gallery_images || business.galleryImages,
        totalReviews: business.total_reviews || business.totalReviews,
        createdAt: business.created_at || business.createdAt,
        status: business.status,
        latitude: business.latitude,
        longitude: business.longitude,
        services: business.services,
        team: business.team,
        socialMediaLinks: business.social_media_links || business.socialMediaLinks,
      }))
    }
  } catch (error) {
    console.error("Error fetching user businesses from API:", error)
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockBusinesses: BusinessData[] = [
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
      openingHours: "Open 24 hours",
      facilities: "Pool, Spa, Restaurant, Conference Rooms, Gym",
      facebook: "facebook.com/sheratonaddis",
      instagram: "instagram.com/sheratonaddis",
      status: "active",
      createdAt: "2023-05-15T10:30:00Z",
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
      mainImage: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
      openingHours: "11:00 AM - 11:00 PM",
      facilities: "Cultural performances, Traditional cuisine",
      facebook: "facebook.com/yodethiopia",
      instagram: "instagram.com/yodethiopia",
      status: "active",
      createdAt: "2023-06-20T14:15:00Z",
    },
  ]

  return mockBusinesses
}

export async function registerBusiness(
  businessData: BusinessData,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Check authentication
    const token = await getAuthToken()
    if (!token) {
      console.error("No authentication token found")
      return {
        success: false,
        error: "Authentication required. Please log in and try again.",
      }
    }

    // Create a copy of the business data for processing
    const updatedBusinessData = { ...businessData }

    // Log initial data for debugging
    console.log("Initial business data:", {
      name: updatedBusinessData.businessName,
      type: updatedBusinessData.businessType,
      hasMainImage: !!updatedBusinessData.mainImage,
      galleryImagesCount: Array.isArray(updatedBusinessData.galleryImages)
        ? updatedBusinessData.galleryImages.length
        : "not an array",
    })

    // Handle main image upload
    if (updatedBusinessData.mainImage instanceof File) {
      try {
        console.log("Uploading main image:", updatedBusinessData.mainImage.name)
        const imageUrl = await uploadBusinessImageToCloudinary(updatedBusinessData.mainImage)
        updatedBusinessData.mainImage = imageUrl
        console.log("Main image uploaded successfully:", imageUrl)
      } catch (error) {
        console.error("Error uploading main image:", error)
        return { success: false, error: "Failed to upload main image" }
      }
    } else if (
      typeof updatedBusinessData.mainImage === "string" &&
      !validateCloudinaryUrl(updatedBusinessData.mainImage)
    ) {
      console.error("Invalid main image URL:", updatedBusinessData.mainImage)
      return { success: false, error: "Invalid main image URL" }
    }

    // Handle gallery images upload
    if (
      Array.isArray(updatedBusinessData.galleryImages) &&
      updatedBusinessData.galleryImages.length > 0 &&
      updatedBusinessData.galleryImages[0] instanceof File
    ) {
      try {
        console.log(`Uploading ${updatedBusinessData.galleryImages.length} gallery images`)
        const galleryUrls = await Promise.all(
          updatedBusinessData.galleryImages.map(async (file: File) => {
            const url = await uploadBusinessImageToCloudinary(file)
            return url
          }),
        )
        updatedBusinessData.galleryImages = galleryUrls.join(",")
        console.log(`Successfully uploaded ${galleryUrls.length} gallery images`)
      } catch (error) {
        console.error("Error uploading gallery images:", error)
        updatedBusinessData.galleryImages = ""
      }
    } else if (
      updatedBusinessData.galleryImages &&
      typeof updatedBusinessData.galleryImages === "string" &&
      !updatedBusinessData.galleryImages.split(",").every((url) => validateCloudinaryUrl(url.trim()))
    ) {
      console.error("Invalid gallery image URLs:", updatedBusinessData.galleryImages)
      return { success: false, error: "Invalid gallery image URLs" }
    }

    // Map frontend fields to backend expected fields
    const mappedBusinessData = {
      name: updatedBusinessData.businessName,
      business_type: updatedBusinessData.businessType,
      description: updatedBusinessData.description,
      region: updatedBusinessData.region,
      city: updatedBusinessData.city,
      address: updatedBusinessData.address,
      contact_phone: updatedBusinessData.phone,
      contact_email: updatedBusinessData.email,
      website: updatedBusinessData.website,
      facebook: updatedBusinessData.facebook,
      instagram: updatedBusinessData.instagram,
      opening_hours: updatedBusinessData.openingHours,
      facilities: updatedBusinessData.facilities,
      services: updatedBusinessData.services,
      team: updatedBusinessData.team,
      latitude: updatedBusinessData.latitude,
      longitude: updatedBusinessData.longitude,
      main_image: updatedBusinessData.mainImage,
      gallery_images: updatedBusinessData.galleryImages,
      social_media_links: updatedBusinessData.socialMediaLinks,
    }

    // Convert to snake_case for API
    const requestBody = toSnakeCase(mappedBusinessData)
    console.log("Sending business data to backend:", requestBody)

    // Send data to API
    const headers = await buildHeaders(true)
    const response = await fetch("https://ai-driven-travel.onrender.com/api/business/businesses/", {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    // Handle API response
    if (!response.ok) {
      let errorMessage = `Failed to register business: ${response.status}`
      try {
        const errorData = await response.json()
        console.error("Backend error response:", errorData)

        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (typeof errorData === "object") {
          // Format field errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
            .join("; ")
          errorMessage = fieldErrors || JSON.stringify(errorData)
        }
      } catch (e) {
        console.error("Could not parse error response:", e)
      }
      return { success: false, error: errorMessage }
    }

    // Success case
    const data = await response.json()
    console.log("Backend response:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error registering business:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function updateBusiness(
  id: string,
  businessData: BusinessData,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Check authentication
    const token = await getAuthToken()
    if (!token) {
      console.error("No authentication token found")
      return {
        success: false,
        error: "Authentication required. Please log in and try again.",
      }
    }

    // Create a copy of the business data for processing
    const updatedBusinessData = { ...businessData }

    // Handle main image upload
    if (updatedBusinessData.mainImage instanceof File) {
      try {
        console.log("Uploading main image:", updatedBusinessData.mainImage.name)
        const imageUrl = await uploadBusinessImageToCloudinary(updatedBusinessData.mainImage)
        updatedBusinessData.mainImage = imageUrl
        console.log("Main image uploaded successfully:", imageUrl)
      } catch (error) {
        console.error("Error uploading main image:", error)
        return { success: false, error: "Failed to upload main image" }
      }
    } else if (
      typeof updatedBusinessData.mainImage === "string" &&
      !validateCloudinaryUrl(updatedBusinessData.mainImage)
    ) {
      console.error("Invalid main image URL:", updatedBusinessData.mainImage)
      return { success: false, error: "Invalid main image URL" }
    }

    // Handle gallery images upload
    if (
      Array.isArray(updatedBusinessData.galleryImages) &&
      updatedBusinessData.galleryImages.length > 0 &&
      updatedBusinessData.galleryImages[0] instanceof File
    ) {
      try {
        console.log(`Uploading ${updatedBusinessData.galleryImages.length} gallery images`)
        const galleryUrls = await Promise.all(
          updatedBusinessData.galleryImages.map(async (file: File) => {
            const url = await uploadBusinessImageToCloudinary(file)
            return url
          }),
        )
        updatedBusinessData.galleryImages = galleryUrls.join(",")
        console.log(`Successfully uploaded ${galleryUrls.length} gallery images`)
      } catch (error) {
        console.error("Error uploading gallery images:", error)
        updatedBusinessData.galleryImages = ""
      }
    } else if (
      updatedBusinessData.galleryImages &&
      typeof updatedBusinessData.galleryImages === "string" &&
      !updatedBusinessData.galleryImages.split(",").every((url) => validateCloudinaryUrl(url.trim()))
    ) {
      console.error("Invalid gallery image URLs:", updatedBusinessData.galleryImages)
      return { success: false, error: "Invalid gallery image URLs" }
    }

    // Map frontend fields to backend expected fields
    const mappedBusinessData = {
      name: updatedBusinessData.businessName,
      business_type: updatedBusinessData.businessType,
      description: updatedBusinessData.description,
      region: updatedBusinessData.region,
      city: updatedBusinessData.city,
      address: updatedBusinessData.address,
      contact_phone: updatedBusinessData.phone,
      contact_email: updatedBusinessData.email,
      website: updatedBusinessData.website,
      facebook: updatedBusinessData.facebook,
      instagram: updatedBusinessData.instagram,
      opening_hours: updatedBusinessData.openingHours,
      facilities: updatedBusinessData.facilities,
      services: updatedBusinessData.services,
      team: updatedBusinessData.team,
      latitude: updatedBusinessData.latitude,
      longitude: updatedBusinessData.longitude,
      main_image: updatedBusinessData.mainImage,
      gallery_images: updatedBusinessData.galleryImages,
      social_media_links: updatedBusinessData.socialMediaLinks,
    }

    // Convert to snake_case for API
    const requestBody = toSnakeCase(mappedBusinessData)
    console.log("Sending updated business data to backend:", requestBody)

    // Send data to API
    const headers = await buildHeaders(true)
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/business/businesses/${id}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(requestBody),
    })

    // Handle API response
    if (!response.ok) {
      let errorMessage = `Failed to update business: ${response.status}`
      try {
        const errorData = await response.json()
        console.error("Backend error response:", errorData)

        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (typeof errorData === "object") {
          // Format field errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
            .join("; ")
          errorMessage = fieldErrors || JSON.stringify(errorData)
        }
      } catch (e) {
        console.error("Could not parse error response:", e)
      }
      return { success: false, error: errorMessage }
    }

    // Success case
    const data = await response.json()
    console.log("Backend response:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error updating business:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function fetchBusinesses(
  params: GetBusinessesParams = {},
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const headers = await buildHeaders()
    const queryParams = new URLSearchParams()
    if (params.category) queryParams.append("category", params.category)
    if (params.region) queryParams.append("region", params.region)
    if (params.city) queryParams.append("city", params.city)
    if (params.query) queryParams.append("query", params.query)

    const response = await fetch(
      `https://ai-driven-travel.onrender.com/api/business/businesses/?${queryParams.toString()}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Fetch businesses error:", errorData)
      return {
        success: false,
        error: errorData.detail || errorData.message || `Failed to fetch businesses: ${response.status}`,
      }
    }

    const data = await response.json()
    console.log("Fetched businesses:", data)
    return { success: true, data: data.results || data }
  } catch (error) {
    console.error("Error fetching businesses:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function fetchBusinessById(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`https://ai-driven-travel.onrender.com/api/business/businesses/${id}/`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.detail || errorData.message || `Failed to fetch business: ${response.status}`,
      }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching business by ID:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
