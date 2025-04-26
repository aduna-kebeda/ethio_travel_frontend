"use client"

import { Button } from "@/components/ui/button"
import { PostCard } from "./post-card"
import { useState } from "react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  author: {
    name: string
    image: string
  }
  category: string
  readTime: string
}

interface LatestPostsProps {
  posts: BlogPost[]
}

export const LatestPosts = ({ posts }: LatestPostsProps) => {
  const [visiblePosts, setVisiblePosts] = useState(3)

  const loadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 3, posts.length))
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest Articles</h2>
        <div className="hidden md:flex items-center space-x-2">
          <span className="h-1 w-10 bg-primary rounded-full"></span>
          <span className="h-1 w-20 bg-gray-200 rounded-full"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, visiblePosts).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {visiblePosts < posts.length && (
        <div className="mt-8 text-center">
          <Button
            onClick={loadMore}
            variant="outline"
            className="rounded-full px-6 border-2 hover:bg-gray-50 transition-all duration-300"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </section>
  )
}
