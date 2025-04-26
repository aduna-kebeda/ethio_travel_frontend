"use client"

import { useState } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenLine, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data - in a real app, this would come from an API call
const mockPosts = [
  {
    id: 1,
    title: "My Journey Through the Simien Mountains",
    excerpt: "A personal account of trekking through Ethiopia's breathtaking mountain range.",
    image: "/placeholder.svg?height=300&width=500&text=Simien+Mountains",
    date: "March 15, 2023",
    status: "published",
    views: 245,
    comments: 12,
  },
  {
    id: 2,
    title: "The Coffee Ceremony: Ethiopia's Cultural Treasure",
    excerpt: "Exploring the traditions and significance of Ethiopia's famous coffee ceremony.",
    image: "/placeholder.svg?height=300&width=500&text=Coffee+Ceremony",
    date: "April 2, 2023",
    status: "published",
    views: 189,
    comments: 8,
  },
  {
    id: 3,
    title: "Hidden Gems of Addis Ababa",
    excerpt: "Discovering the lesser-known attractions in Ethiopia's vibrant capital city.",
    image: "/placeholder.svg?height=300&width=500&text=Addis+Ababa",
    date: "May 10, 2023",
    status: "draft",
    views: 0,
    comments: 0,
  },
]

export default function MyBlogPosts() {
  const { toast } = useToast()
  const [posts, setPosts] = useState(mockPosts)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)

  const publishedPosts = posts.filter((post) => post.status === "published")
  const draftPosts = posts.filter((post) => post.status === "draft")

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (postToDelete) {
      // In a real app, this would call an API to delete the post
      setPosts(posts.filter((post) => post.id !== postToDelete))

      toast({
        title: "Post deleted",
        description: "Your blog post has been deleted successfully.",
      })

      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  const renderPostList = (postList: typeof posts) => {
    if (postList.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You don't have any posts in this category yet.</p>
          <Button asChild>
            <Link href="/blog/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {postList.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 h-48 md:h-auto">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-3/4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">Published: {post.date}</span>
                    {post.status === "published" && (
                      <>
                        <span className="mr-4">Views: {post.views}</span>
                        <span>Comments: {post.comments}</span>
                      </>
                    )}
                    {post.status === "draft" && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/edit/${post.id}`}>
                      <PenLine className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${post.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(post.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">My Blog Posts</h1>
            <Button asChild>
              <Link href="/blog/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="published" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="published">{renderPostList(publishedPosts)}</TabsContent>

            <TabsContent value="drafts">{renderPostList(draftPosts)}</TabsContent>
          </Tabs>
        </div>
      </Container>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
