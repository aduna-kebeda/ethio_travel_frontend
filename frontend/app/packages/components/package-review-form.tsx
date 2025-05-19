"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { submitPackageReview } from "@/app/actions/package-actions"
import { StarRating } from "@/app/business/components/star-rating"

interface PackageReviewFormProps {
  packageId: string
}

export function PackageReviewForm({ packageId }: PackageReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating < 1) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitPackageReview(packageId, { rating, comment })

      if (result.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        })

        // Reset form
        setRating(5)
        setComment("")

        // Refresh the page to show the new review
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review. Please try again.",
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
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Your Rating
        </label>
        <StarRating rating={rating} onRatingChange={setRating} editable size="large" />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this tour package..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="bg-[#E91E63] hover:bg-[#D81B60]" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
