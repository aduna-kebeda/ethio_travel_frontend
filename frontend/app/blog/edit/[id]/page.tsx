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
import { updateBlogPost, getBlogPost } from "@/app/actions/blog-actions"
import ImageUpload from "../../components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "culture", name: "Culture" },
  { id: "travel", name: "Travel" },
  { id: "technology", name: "Technology" },
  { id: "food", name: "Food" },
  { id: "history", name: "History" },
  { id: "adventure", name: "Adventure" },
]

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
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState("")
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const post = await getBlogPost(postId)

        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          imageUrl: post.imageUrl,
          tags: post.tags || [],
        })
        setImageUrl(post.imageUrl)
      } catch (error) {
        console.error("Error fetching post:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId, toast])

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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
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

      // Log the data being sent to the backend
      console.log("Updating blog post data:", {
        id: postId,
        ...formData,
      })

      await updateBlogPost(postId, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        imageUrl: imageUrl, // This should be the Cloudinary URL
      })

      toast({
        title: "Success!",
        description: "Your blog post has been updated.",
      })

      router.push("/blog/my-posts")
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update your blog post. Please try again.",
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
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags (press Enter to add)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={(url) => {
                    console.log("Image uploaded to Cloudinary:", url)
                    setImageUrl(url)
                  }}
                  label="Upload Featured Image"
                />
                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl || "/placeholder.svg"}
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
