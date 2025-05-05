"use client"

import Link from "next/link"
import { Calendar, Clock, MessageSquare, Heart } from 'lucide-react'
import { ClientOnly } from "@/components/client-only"

interface Post {
  id: number | string
  title: string
  excerpt?: string
  content?: string
  image?: string
  imageUrl?: string
  date?: string
  createdAt?: string
  author?: {
    name: string
    image: string
  }
  authorName?: string
  authorImage?: string
  category?: string
  readTime?: string | number
  commentsCount?: number
  likesCount?: number
}

interface PostCardProps {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  // Handle different property names that might come from different sources
  const imageUrl = post.image || post.imageUrl || "/placeholder.svg"
  const authorName = post.author?.name || post.authorName || "Unknown Author"
  const authorImage = post.author?.image || post.authorImage || "/placeholder.svg"
  const content = post.excerpt || post.content || ""
  const date = post.date || post.createdAt || "Unknown date"
  const readTime = typeof post.readTime === 'number' ? `${post.readTime} min read` : post.readTime || "5 min read"

  return (
    <ClientOnly>
      <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
        <Link href={`/blog/${post.id}`} className="block relative aspect-[16/9] overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {post.category && (
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </div>
          )}
        </Link>

        <div className="p-6 flex flex-col flex-grow">
          <Link href={`/blog/${post.id}`} className="block mb-3 group">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-3">{content}</p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full overflow-hidden mr-2 border border-gray-200">
                  <img src={authorImage || "/placeholder.svg"} alt={authorName} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm font-medium">{authorName}</span>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {post.commentsCount !== undefined && (
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {post.commentsCount}
                  </div>
                )}
                {post.likesCount !== undefined && (
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {post.likesCount}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500 mt-2">
              <div className="flex items-center mr-4">
                <Calendar className="h-3 w-3 mr-1" />
                {date}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {readTime}
              </div>
            </div>
          </div>
        </div>
      </article>
    </ClientOnly>
  )
}
