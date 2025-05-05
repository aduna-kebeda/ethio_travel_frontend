"use client"

import Link from "next/link"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { ClientOnly } from "@/components/client-only"

interface Author {
  name: string
  image: string
}

interface Post {
  id: number | string
  title: string
  excerpt: string
  image: string
  date: string
  author: Author
  category?: string
  readTime: string
}

interface LatestPostsProps {
  posts: Post[]
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  // Process posts to ensure consistent data structure for PostCard
  const processedPosts = posts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    content: post.excerpt,
    imageUrl: post.image,
    category: post.category,
    tags: [],
    authorName: post.author.name,
    authorImage: post.author.image,
    createdAt: post.date,
    commentsCount: 0,
    likesCount: 0,
    readTime: Number.parseInt(post.readTime.split(" ")[0]) || 5,
  }))

  return (
    <ClientOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link href="/blog/latest" className="text-primary hover:underline text-sm font-medium">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/blog/latest">
            <Button variant="outline" className="rounded-full px-8">
              Load More
            </Button>
          </Link>
        </div>
      </div>
    </ClientOnly>
  )
}
