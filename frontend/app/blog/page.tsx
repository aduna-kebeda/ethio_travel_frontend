import { Container } from "@/components/container"
import { HeroSection } from "./components/hero-section"
import { SearchFilter } from "./components/search-filter"
import { LatestPosts } from "./components/latest-posts"
import { FeaturedPosts } from "./components/featured-posts"
import { CategorySection } from "./components/category-section"
import { Newsletter } from "./components/newsletter"
import { ScrollToTop } from "./components/scroll-to-top"
import { CreatePostCTA } from "./components/create-post-cta"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { getBlogPosts, getFeaturedBlogPosts, getBlogCategories } from "@/app/actions/blog-actions"
import { Suspense } from "react"

async function BlogPageContent() {
  // Fetch data from the API
  const postsData = await getBlogPosts()
  const featuredPostsData = await getFeaturedBlogPosts()
  const categoriesData = await getBlogCategories()

  // Format dates consistently for server and client
  const formatDateConsistently = (dateString: string): string => {
    if (!dateString) return "Unknown date"
    try {
      const date = new Date(dateString)
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Extract the first featured post for the hero section
  const featuredPost = featuredPostsData[0]
    ? {
        id: featuredPostsData[0].id,
        title: featuredPostsData[0].title,
        excerpt: featuredPostsData[0].excerpt,
        image: featuredPostsData[0].imageUrl || "/placeholder.svg?height=300&width=500&text=No+Image",
        date: formatDateConsistently(featuredPostsData[0].created_at),
        author: {
          name:
            featuredPostsData[0].authorName ||
            (featuredPostsData[0].author
              ? `${featuredPostsData[0].author.first_name} ${featuredPostsData[0].author.last_name}`.trim() ||
                featuredPostsData[0].author.username
              : "Unknown"),
          image: "/placeholder.svg?height=40&width=40",
        },
        category: featuredPostsData[0].category,
        readTime: `${featuredPostsData[0].readTime} min read`,
      }
    : {
        id: 1,
        title: "The impact of Timket or epiphany holiday in shaping ethiopian economy",
        excerpt:
          "Exploring Ethiopia's rich tapestry of traditions and festivals, we delve into the profound impact of Timket on the country's cultural heritage and economic landscape.",
        image: "/placeholder.svg?height=300&width=500&text=Timket+Festival",
        date: "January 15, 2023",
        author: {
          name: "Abebe Kebede",
          image: "/placeholder.svg?height=40&width=40",
        },
        category: "Culture",
        readTime: "8 min read",
      }

  // Extract the remaining featured posts
  const otherFeaturedPosts = featuredPostsData.slice(1, 3).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    image: post.imageUrl || "/placeholder.svg?height=300&width=500&text=No+Image",
    date: formatDateConsistently(post.created_at),
    author: {
      name:
        post.authorName ||
        (post.author ? `${post.author.first_name} ${post.author.last_name}`.trim() || post.author.username : "Unknown"),
      image: "/placeholder.svg?height=40&width=40",
    },
    category: post.category,
    readTime: `${post.readTime} min read`,
  }))

  // Map the latest posts with correct properties
  const latestPosts = postsData.results.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    image: post.imageUrl || "/placeholder.svg?height=300&width=500&text=No+Image",
    date: formatDateConsistently(post.created_at),
    author: {
      name:
        post.authorName ||
        (post.author ? `${post.author.first_name} ${post.author.last_name}`.trim() || post.author.username : "Unknown"),
      image: "/placeholder.svg?height=40&width=40",
    },
    category: post.category,
    readTime: `${post.readTime} min read`,
  }))

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Container>
          <div className="py-8 space-y-12">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Blog</h1>
              <Link href="/blog/create">
                <Button className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            </div>

            <HeroSection featuredPost={featuredPost} />
            <SearchFilter categories={categoriesData.map((cat) => cat.name)} />
            <FeaturedPosts posts={otherFeaturedPosts} />
            <LatestPosts posts={latestPosts} />
            <CreatePostCTA />
            <CategorySection categories={categoriesData.map((cat) => ({ ...cat, image: "/placeholder.svg?height=40&width=40" }))} />
            <Newsletter />
          </div>
        </Container>
      </main>
      <ScrollToTop />
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <p className="text-lg font-semibold">Loading Blog...</p>
            <p className="text-gray-500">Please wait a moment</p>
          </div>
        </div>
      }
    >
      <BlogPageContent />
    </Suspense>
  )
}
