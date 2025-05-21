"use server"

import { cookies } from "next/headers"
import { getCurrentUser, isAuthenticated } from "@/app/actions/auth-actions"

// API base URL
const API_BASE_URL = "https://ai-driven-travel.onrender.com"

// Types based on the API response
export interface Author {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  imageUrl: string // Can be empty string per API
  author: Author
  authorName: string
  status: "draft" | "published"
  views: number
  readTime: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  post: number
  author: Author
  content: string
  helpful_count: number
  reported: boolean
  created_at: string
  updated_at: string
}

interface BlogPostsResponse {
  count: number
  next: string | null
  previous: string | null
  results: BlogPost[]
}

interface CommentsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Comment[]
}

interface BlogPostData {
  title: string
  excerpt: string
  content: string
  category: string
  tags?: string[]
  imageUrl?: string
  status?: "draft" | "published"
  readTime?: number
  featured?: boolean
}

interface CommentData {
  content: string
}

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value
  return token || null
}

// Helper function to validate Cloudinary URL
function validateCloudinaryUrl(url: string): boolean {
  return url === "" || url.startsWith("https://res.cloudinary.com/")
}

// Helper function to build headers
async function buildHeaders(requireAuth = false): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
  const token = await getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  } else if (requireAuth) {
    throw new Error("Authentication required: No access token found")
  }
  return headers
}

export async function getBlogPosts(page = 1, search = "", category = "") {
  try {
    const params = new URLSearchParams()
    if (page > 1) params.append("page", page.toString())
    if (search) params.append("search", search)
    if (category && category !== "All") params.append("category", category)

    const headers = await buildHeaders()
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/?${params.toString()}`, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`)
    }

    const data: BlogPostsResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { count: 0, next: null, previous: null, results: [] }
  }
}

export async function getBlogPost(id: number): Promise<BlogPost | null> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}/`, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch blog post: ${response.status}`)
    }

    const data: BlogPost = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/?featured=true`, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch featured blog posts: ${response.status}`)
    }

    const data: BlogPostsResponse = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching featured blog posts:", error)
    return []
  }
}

export async function getBlogCategories() {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/`, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blog categories: ${response.status}`)
    }

    const data: BlogPostsResponse = await response.json()
    const categoryCounts: { [key: string]: number } = {}
    data.results.forEach((post) => {
      const category = post.category || "Uncategorized"
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    return [
      { name: "All", count: data.results.length },
      ...Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ]
  } catch (error) {
    console.error("Error deriving blog categories:", error)
    return []
  }
}

export async function createBlogPost(data: BlogPostData) {
  try {
    // Check authentication
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      throw new Error("You must be logged in to create a blog post")
    }

    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unable to retrieve user data")
    }

    // Validate imageUrl
    if (data.imageUrl && !validateCloudinaryUrl(data.imageUrl)) {
      throw new Error("Invalid Cloudinary URL provided")
    }

    const headers = await buildHeaders(true)
    const imageUrl = data.imageUrl || ""

    // Prepare request body
    const requestBody = {
      ...data,
      tags: data.tags || [],
      status: data.status || "draft",
      readTime: data.readTime || 5,
      featured: data.featured || false,
      imageUrl, // Use camelCase for consistency with BlogPost interface
      author: user.id, // Include author ID
    }

    console.log("Sending to backend:", requestBody)

    const response = await fetch(`${API_BASE_URL}/api/blog/posts/`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to create blog post: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const responseData = await response.json()
    console.log("Backend response:", responseData)
    return responseData
  } catch (error) {
    console.error("Error creating blog post:", error)
    throw error instanceof Error ? error : new Error("An unexpected error occurred")
  }
}

export async function updateBlogPost(id: number, data: BlogPostData) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      throw new Error("You must be logged in to update a blog post")
    }

    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unable to retrieve user data")
    }

    if (data.imageUrl && !validateCloudinaryUrl(data.imageUrl)) {
      throw new Error("Invalid Cloudinary URL provided")
    }

    const headers = await buildHeaders(true)
    const requestBody = {
      ...data,
      tags: data.tags || [],
      imageUrl: data.imageUrl || "",
      author: user.id,
    }

    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(requestBody),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to update blog post: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw error
  }
}

export async function deleteBlogPost(id: number) {
  try {
    const headers = await buildHeaders(true)
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}/`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to delete blog post: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    throw error
  }
}

export async function addComment(postId: number, content: string): Promise<Comment> {
  try {
    // Verify authentication
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      throw new Error("Authentication required: You must be logged in to comment")
    }

    // Get auth token and build headers
    const headers = await buildHeaders(true)

    // Prepare request body according to API documentation
    // The API requires both post ID and content
    const requestBody = {
      post: postId, // Include the post ID in the request body
      content,
    }

    console.log(`Sending comment to post ${postId}:`, requestBody)

    // Make API request to the correct endpoint
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      let errorMessage = `Failed to add comment: ${response.status}`
      try {
        const errorData = await response.json()
        console.error("Error response data:", errorData)
        if (errorData && typeof errorData === "object") {
          const errorDetails = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
          errorMessage += ` - ${errorDetails}`
        }
      } catch (e) {
        const errorText = await response.text()
        console.error("Error response text:", errorText)
        if (errorText) {
          errorMessage += ` - ${errorText}`
        }
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log("Comment added successfully:", data)
    return data
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error instanceof Error ? error : new Error("An unexpected error occurred")
  }
}

export async function getComments(postId: number): Promise<Comment[]> {
  try {
    const headers = await buildHeaders()
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/`, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) return []
      throw new Error(`Failed to fetch comments: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.results || []
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

/*
// Disabled due to non-functional /helpful/ endpoint (returns 500 Internal Server Error)
export async function markCommentHelpful(postId: number, commentId: number): Promise<{ success: boolean }> {
  try {
    // Validate inputs
    if (!Number.isInteger(postId) || postId <= 0) {
      throw new Error("Invalid post ID")
    }
    if (!Number.isInteger(commentId) || commentId <= 0) {
      throw new Error("Invalid comment ID")
    }

    // Verify authentication
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      throw new Error("Authentication required: You must be logged in to mark a comment as helpful")
    }

    const headers = await buildHeaders(true)
    console.log(`Marking comment ${commentId} as helpful for post ${postId}`)

    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/${commentId}/helpful/`, {
      method: "POST",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      let errorMessage = `Failed to mark comment as helpful: ${response.status}`
      try {
        const errorData = await response.json()
        console.error("Error response data:", errorData)
        if (errorData && typeof errorData === "object") {
          const errorDetails = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
          errorMessage += ` - ${errorDetails}`
        }
      } catch (e) {
        const errorText = await response.text()
        console.error("Error response text:", errorText)
        if (errorText) {
          errorMessage += ` - ${errorText}`
        }
      }
      throw new Error(errorMessage)
    }

    console.log("Comment marked as helpful successfully")
    return { success: true }
  } catch (error) {
    console.error("Error marking comment as helpful:", error)
    throw error instanceof Error ? error : new Error("An unexpected error occurred")
  }
}
*/

export async function reportComment(postId: number, commentId: number): Promise<{ success: boolean }> {
  try {
    const headers = await buildHeaders(true)
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/${commentId}/report/`, {
      method: "POST",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to report comment: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error reporting comment:", error)
    throw error
  }
}