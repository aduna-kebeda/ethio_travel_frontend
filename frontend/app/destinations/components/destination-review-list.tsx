import { formatDistanceToNow } from "date-fns"
import { Star, ThumbsUp, Flag } from "lucide-react"
import type { ReviewData } from "@/app/actions/destination-actions"

interface DestinationReviewListProps {
  reviews: ReviewData[]
}

export function DestinationReviewList({ reviews }: DestinationReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 mb-4">Be the first to review this destination</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
              {review.user.first_name.charAt(0)}
              {review.user.last_name.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h4 className="font-medium">
                    {review.user.first_name} {review.user.last_name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              <h5 className="font-bold mb-2">{review.title}</h5>
              <p className="text-gray-700">{review.content}</p>

              <div className="flex items-center gap-4 mt-3">
                <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> Helpful ({review.helpful})
                </button>
                <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                  <Flag className="h-4 w-4" /> Report
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
