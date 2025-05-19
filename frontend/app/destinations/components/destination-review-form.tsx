"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"
import { submitDestinationReview } from "@/app/actions/destination-actions"

interface DestinationReviewFormProps {
  destinationId: string
  onReviewSubmitted: () => void
}

export function DestinationReviewForm({ destinationId, onReviewSubmitted }: DestinationReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your review",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitDestinationReview(destinationId, {
        rating,
        title,
        content,
      })

      if (result.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for sharing your experience!",
        })

        // Reset form
        setRating(5)
        setTitle("")
        setContent("")

        // Notify parent component
        onReviewSubmitted()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
              <Star className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">{rating} out of 5 stars</span>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Review Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this destination..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
          required
        />
      </div>

      <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
