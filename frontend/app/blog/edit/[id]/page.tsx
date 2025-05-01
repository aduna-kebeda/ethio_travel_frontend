"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateBlogPost } from "@/app/actions/blog-actions"
import { ImageUpload } from "../../components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "culture", name: "Culture" },
  { id: "travel", name: "Travel" },
  { id: "technology", name: "Technology" },
  { id: "food", name: "Food" },
  { id: "history", name: "History" },
  { id: "adventure", name: "Adventure" },
]

// Mock data - in a real app, this would come from an API call
const mockPost = {
  id: 1,
  title: "My Journey Through the Simien Mountains",
  excerpt: "A personal account of trekking through Ethiopia's breathtaking mountain range.",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
  category: "adventure",
  imageUrl: "/placeholder.svg?height=300&width=500&text=Simien+Mountains",
  date: "March 15, 2023",
  status: "published",
}

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const postId = Number.parseInt(params.id)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
  })

  useEffect(() => {
    // In a real app, this would fetch the post data from an API
    setFormData({
      title: mockPost.title,
      excerpt: mockPost.excerpt,
      content: mockPost.content,
      category: mockPost.category,
      imageUrl: mockPost.imageUrl,
    })
    setIsLoading(false)
  }, [postId])

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

      // In a real implementation, this would call a server action to update the post
      await updateBlogPost(postId, formData)

      toast({
        title: "Success!",
        description: "Your blog post has been updated.",
      })

      router.push("/blog/my-posts")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/blog/my-posts" className="flex items-center text-gray-600 hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Posts
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Blog Post</h1>

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
                <ImageUpload onImageUploaded={handleImageUpload} currentImage={formData.imageUrl} />
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
                <Button type="button" variant="outline" onClick={() => router.push("/blog/my-posts")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Post"
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
