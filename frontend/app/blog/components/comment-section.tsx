"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addComment, getComments, markCommentHelpful, reportComment } from "@/app/actions/blog-actions"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, ThumbsUp, Flag, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Author {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
}

interface Comment {
  id: number
  post: number
  author: Author
  content: string
  helpful_count: number
  reported: boolean
  created_at: string
  updated_at: string
}

interface CommentSectionProps {
  postId: number
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(Array.isArray(initialComments) ? initialComments : [])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true)
        const fetchedComments = await getComments(postId)
        setComments(fetchedComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId, toast])

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on this post.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Validate comment length
      if (newComment.length < 3) {
        throw new Error("Comment must be at least 3 characters long")
      }

      const comment = await addComment(postId, newComment)

      // Add the new comment to the list
      setComments((prev) => [comment, ...prev])
      setNewComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkHelpful = async (commentId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to mark comments as helpful.",
        variant: "destructive",
      })
      return
    }

    try {
      await markCommentHelpful(postId, commentId)

      // Update the comment in the UI
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, helpful_count: comment.helpful_count + 1 } : comment,
        ),
      )

      toast({
        title: "Marked as helpful",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error marking comment as helpful:", error)
      toast({
        title: "Error",
        description: "Failed to mark comment as helpful. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReportComment = async (commentId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report comments.",
        variant: "destructive",
      })
      return
    }

    try {
      await reportComment(postId, commentId)

      // Update the comment in the UI
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, reported: true } : comment)))

      toast({
        title: "Comment reported",
        description: "Thank you for helping us maintain a respectful community.",
      })
    } catch (error) {
      console.error("Error reporting comment:", error)
      toast({
        title: "Error",
        description: "Failed to report comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <MessageCircle className="mr-2 h-5 w-5" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          placeholder={isAuthenticated ? "Write your comment here..." : "Sign in to leave a comment"}
          value={newComment}
          onChange={handleCommentChange}
          className="w-full mb-4 min-h-[100px]"
          disabled={isSubmitting || !isAuthenticated}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!isAuthenticated || isSubmitting || !newComment.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !Array.isArray(comments) || comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200">
                    <img
                      src={"/placeholder.svg?height=32&width=32"}
                      alt={`${comment.author?.first_name || "User"} ${comment.author?.last_name || ""}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {comment.author
                        ? `${comment.author.first_name || ""} ${comment.author.last_name || ""}`
                        : "Anonymous User"}
                    </h4>
                    <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <button
                  className="flex items-center mr-4 hover:text-primary"
                  onClick={() => handleMarkHelpful(comment.id)}
                  disabled={comment.reported}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({comment.helpful_count})
                </button>
                <button
                  className="flex items-center hover:text-red-500"
                  onClick={() => handleReportComment(comment.id)}
                  disabled={comment.reported}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {comment.reported ? "Reported" : "Report"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
