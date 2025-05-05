"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBlogPost } from "@/app/actions/blog-actions"
import ImageUpload from "../components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Edit, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ClientOnly } from "@/components/client-only"

const categories = [
  { id: "culture", name: "Culture" },
  { id: "travel", name: "Travel" },
  { id: "technology", name: "Technology" },
  { id: "food", name: "Food" },
  { id: "history", name: "History" },
  { id: "adventure", name: "Adventure" },
]

export function CreatePostCTA() {
  return (
    <ClientOnly>
      <div className="bg-gradient-to-r from-primary/80 to-primary rounded-xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="md:w-2/3">
            <div className="bg-white text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Edit className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Share your Ethiopian adventure</h3>
            <p className="text-white/90">
              Have a story to tell about your travels in Ethiopia? Create a blog post and share your experiences with
              our community.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-start md:justify-end">
            <Link href="/blog/create">
              <Button variant="secondary" className="group">
                Create a Post
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
}

export default function CreateBlogPost() {
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await createBlogPost(formData)
      toast({
        title: "Success!",
        description: "Your blog post has been published.",
      })
      router.push("/blog")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish your blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/blog" className="flex items-center text-gray-600 hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Blog Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a compelling title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Write a short summary of your post"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full h-20"
                />
                <p className="text-xs text-gray-500">A brief summary that will appear in blog listings (optional)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your blog post content here"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full min-h-[300px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload value={formData.imageUrl} onChange={handleImageUpload} />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Featured image preview"
                      className="h-40 w-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/blog")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )
}