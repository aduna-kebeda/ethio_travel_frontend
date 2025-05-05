"use client"

import { Calendar, Clock } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
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

interface HeroSectionProps {
  featuredPost: BlogPost
}

export const HeroSection = ({ featuredPost }: HeroSectionProps) => {
  return (
    <ClientOnly>
      <section className="relative h-[500px] rounded-xl overflow-hidden group mb-8">
        <div className="absolute inset-0">
          <img
            src={featuredPost.image || "/placeholder.svg"}
            alt={featuredPost.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>

        <div className="relative h-full flex items-end pb-12 px-6">
          <div className="max-w-2xl text-white">
            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {featuredPost.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{featuredPost.title}</h1>
            <p className="text-base text-gray-200 mb-6">{featuredPost.excerpt}</p>
            <div className="flex flex-wrap items-center mb-6 gap-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full overflow-hidden mr-2 border-2 border-white">
                  <img
                    src={featuredPost.author.image || "/placeholder.svg"}
                    alt={featuredPost.author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{featuredPost.author.name}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {featuredPost.date}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {featuredPost.readTime}
              </div>
            </div>
            <Button asChild className="rounded-full px-6">
              <Link href={`/blog/${featuredPost.id}`}>Read Article</Link>
            </Button>
          </div>
        </div>
      </section>
    </ClientOnly>
  )
}
