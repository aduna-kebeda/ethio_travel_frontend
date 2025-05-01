import { NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const posts = [
  {
    id: "1",
    title: "The impact of Timket or epiphany holiday in shaping ethiopian economy",
    excerpt:
      "Exploring Ethiopia's rich tapestry of traditions and festivals, we delve into the profound impact of Timket on the country's cultural heritage and economic landscape.",
    content: "Full content would be here...",
    image: "/assets/timket.png",
    date: "January 15, 2023",
    author: {
      name: "Abebe Kebede",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "Culture",
    tags: ["Culture", "Festival", "Economy", "Tourism", "Religion"],
  },
  {
    id: "2",
    title: "The adventurous and diverse side of Ethiopia in the Eyes of Tourists",
    excerpt: "Discover how international visitors perceive Ethiopia's natural wonders and cultural treasures.",
    content: "Full content would be here...",
    image: "/placeholder.svg?height=300&width=500&text=Ethiopia+Landscape",
    date: "February 10, 2023",
    author: {
      name: "Tigist Haile",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "Travel",
    tags: ["Travel", "Tourism", "Adventure", "Culture"],
  },
  {
    id: "3",
    title: "The Impact of Technology on the Ethiopian Tourism - How Technology is Changing",
    excerpt: "Exploring how digital innovations are transforming the way travelers experience Ethiopia.",
    content: "Full content would be here...",
    image: "/placeholder.svg?height=300&width=500&text=Tech+Tourism",
    date: "March 5, 2023",
    author: {
      name: "Daniel Mekonnen",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "Technology",
    tags: ["Technology", "Innovation", "Digital", "Tourism"],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const tag = searchParams.get("tag")

  let filteredPosts = [...posts]

  if (category && category !== "All") {
    filteredPosts = filteredPosts.filter((post) => post.category === category)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower),
    )
  }

  if (tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
  }

  return NextResponse.json(filteredPosts)
}
