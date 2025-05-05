"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import ImageUpload from "../components/image-upload"
import { createBlogPost } from "@/app/actions/blog-actions"
import { useToast } from "@/hooks/use-toast"

const categories = [
  { value: "travel", label: "Travel" },
  { value: "culture", label: "Culture" },
  { value: "food", label: "Food" },
  { value: "adventure", label: "Adventure" },
  { value: "history", label: "History" },
  { value: "technology", label: "Technology" },
]

export default function CreateBlogPost() {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate image for published posts
    if (!imageUrl && status === "published") {
      toast({
        title: "Image Required",
        description: "Please upload a featured image for published posts.",
        variant: "destructive",
      })
      return
    }

    // Validate Cloudinary URL
    if (imageUrl && !imageUrl.startsWith("https://res.cloudinary.com/")) {
      toast({
        title: "Invalid Image URL",
        description: "The uploaded image URL is not a valid Cloudinary URL.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const postData = {
        title,
        excerpt,
        content,
        category,
        tags: tagArray,
        imageUrl,
        status,
        featured,
      }

      console.log("Sending blog post data:", postData) // Log for debugging

      await createBlogPost(postData)

      toast({
        title: "Success!",
        description: `Blog post ${status === "published" ? "published" : "saved as draft"}.`,
      })

      router.push("/blog")
    } catch (error) {
      console.error("Error creating blog post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief summary (1-2 sentences)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas (e.g., travel, adventure, hiking)"
            />
          </div>

          <div className="space-y-2">
            <Label>Featured Image {status === "published" && <span className="text-red-500">*</span>}</Label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => {
                console.log("Received image URL:", url) // Log for debugging
                setImageUrl(url)
              }}
              label="Upload Featured Image"
            />
            {status === "published" && !imageUrl && (
              <p className="text-sm text-red-500">A featured image is required for published posts</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            <Label htmlFor="featured">Feature this post</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              variant="outline"
              onClick={() => setStatus("draft")}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button type="submit" onClick={() => setStatus("published")} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}