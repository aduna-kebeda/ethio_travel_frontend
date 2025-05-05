"use client"

import Link from "next/link"
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { ClientOnly } from "@/components/client-only"

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

interface FeaturedPostsProps {
  posts: BlogPost[]
}

export const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  return (
    <ClientOnly>
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Posts</h2>
          <Link href="/blog" className="flex items-center text-primary hover:underline font-medium">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group"
            >
              <Link href={`/blog/${post.id}`} className="block md:w-2/5">
                <div className="relative h-56 md:h-full overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
              </Link>

              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <Link href={`/blog/${post.id}`} className="block">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                </div>

                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2 border border-gray-200">
                      <img
                        src={post.author.image || "/placeholder.svg"}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ClientOnly>
  )
}
