import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getBlogPost, getComments } from "@/app/actions/blog-actions"
import { CommentSection } from "@/app/blog/components/comment-section"
import { ScrollToTop } from "@/app/blog/components/scroll-to-top"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) return { title: "Blog Post Not Found" }

  const post = await getBlogPost(id)
  if (!post) return { title: "Blog Post Not Found" }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) return notFound()

  const post = await getBlogPost(id)
  if (!post) return notFound()

  const comments = await getComments(id)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-[400px] object-cover"
            width={800}
            height={400}
          />
        </div>
      )}

      {/* Post Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-500 text-sm mb-4">
          <div className="flex items-center mr-6 mb-2">
            <User className="mr-2 h-4 w-4" />
            <span>
              {post.author?.first_name} {post.author?.last_name}
            </span>
          </div>
          <div className="flex items-center mr-6 mb-2">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center mb-2">
            <Clock className="mr-2 h-4 w-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{post.category}</span>
          {post.tags &&
            post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Post Content */}
      <div className="prose max-w-none mb-12">
        {post.excerpt && <p className="text-lg font-medium mb-6">{post.excerpt}</p>}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Comments Section */}
      <CommentSection postId={id} initialComments={comments} />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}
