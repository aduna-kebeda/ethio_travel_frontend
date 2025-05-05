import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get("postId")

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
  }

  try {
    // This would normally fetch comments from a database
    // For now, we'll return mock data
    const mockComments = [
      {
        id: 1,
        post: Number(postId),
        author: {
          id: "1",
          username: "johndoe",
          email: "john@example.com",
          first_name: "John",
          last_name: "Doe",
        },
        content: "This is a great post! I learned a lot about Ethiopia's culture.",
        helpful_count: 5,
        reported: false,
        created_at: "2023-05-15T10:30:00Z",
        updated_at: "2023-05-15T10:30:00Z",
      },
      {
        id: 2,
        post: Number(postId),
        author: {
          id: "2",
          username: "sarahjohnson",
          email: "sarah@example.com",
          first_name: "Sarah",
          last_name: "Johnson",
        },
        content: "I visited Ethiopia last year and this post brings back so many memories!",
        helpful_count: 3,
        reported: false,
        created_at: "2023-05-16T14:45:00Z",
        updated_at: "2023-05-16T14:45:00Z",
      },
    ]

    return NextResponse.json(mockComments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const { postId, content } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 })
    }

    // This would normally save the comment to a database
    // For now, we'll return mock data
    const mockComment = {
      id: Math.floor(Math.random() * 1000) + 3, // Random ID
      post: Number(postId),
      author: {
        id: session.user.id || "user-id",
        username: session.user.name?.toLowerCase().replace(/\s/g, "") || "username",
        email: session.user.email || "user@example.com",
        first_name: session.user.name?.split(" ")[0] || "User",
        last_name: session.user.name?.split(" ")[1] || "",
      },
      content,
      helpful_count: 0,
      reported: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(mockComment)
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
