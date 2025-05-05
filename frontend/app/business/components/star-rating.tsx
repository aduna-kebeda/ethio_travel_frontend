"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  editable?: boolean
  size?: "small" | "medium" | "large"
  className?: string
}

export function StarRating({ rating, onRatingChange, editable = false, size = "medium", className }: StarRatingProps) {
  const maxRating = 5

  // Determine star size based on prop
  const starSizeClass = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-6 h-6",
  }[size]

  // Determine gap size based on star size
  const gapClass = {
    small: "gap-0.5",
    medium: "gap-1",
    large: "gap-2",
  }[size]

  const handleClick = (selectedRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(selectedRating)
    }
  }

  const handleMouseEnter = (hoveredRating: number) => {
    // This would be used for hover effects if needed
  }

  return (
    <div className={cn("flex items-center", gapClass, className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating

        return (
          <Star
            key={index}
            className={cn(
              starSizeClass,
              "cursor-default transition-colors",
              isFilled ? "text-amber-400 fill-amber-400" : "text-gray-300",
              editable && "cursor-pointer hover:text-amber-400",
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
          />
        )
      })}
    </div>
  )
}
