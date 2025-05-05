import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL = "https://ai-driven-travel.onrender.com"

export async function POST(request: NextRequest) {
  try {
    const { postId, commentId } = await request.json()

    if (!postId || !commentId) {
      return NextResponse.json({ error: "Post ID and comment ID are required" }, { status: 400 })
    }

    // Get auth token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/${commentId}/report/`, {
      method: "POST",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to report comment: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reporting comment:", error)
    return NextResponse.json({ error: "Failed to report comment" }, { status: 500 })
  }
}
