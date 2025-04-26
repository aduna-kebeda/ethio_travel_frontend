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
import { Plus } from "lucide-react"

export default function BlogPage() {
  // This would normally be fetched from an API
  const featuredPost = {
    id: 1,
    title: "The impact of Timket or epiphany holiday in shaping ethiopian economy",
    excerpt:
      "Exploring Ethiopia's rich tapestry of traditions and festivals, we delve into the profound impact of Timket on the country's cultural heritage and economic landscape.",
    image: "/placeholder.svg?height=600&width=1200&text=Timket+Festival",
    date: "January 15, 2023",
    author: {
      name: "Abebe Kebede",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "Culture",
    readTime: "8 min read",
  }

  const featuredPosts = [
    {
      id: 2,
      title: "The adventurous and diverse side of Ethiopia in the Eyes of Tourists",
      excerpt: "Discover how international visitors perceive Ethiopia's natural wonders and cultural treasures.",
      image: "/placeholder.svg?height=300&width=500&text=Ethiopia+Landscape",
      date: "February 10, 2023",
      author: {
        name: "Tigist Haile",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Travel",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "The Impact of Technology on the Ethiopian Tourism - How Technology is Changing",
      excerpt: "Exploring how digital innovations are transforming the way travelers experience Ethiopia.",
      image: "/placeholder.svg?height=300&width=500&text=Tech+Tourism",
      date: "March 5, 2023",
      author: {
        name: "Daniel Mekonnen",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Technology",
      readTime: "5 min read",
    },
  ]

  const posts = [
    {
      id: 4,
      title: "The Impact of Technology on the Ethiopian Tourism - How Technology is Changing",
      excerpt: "A deeper look at the digital transformation of Ethiopia's tourism sector.",
      image: "/placeholder.svg?height=300&width=500&text=Digital+Tourism",
      date: "April 12, 2023",
      author: {
        name: "Sara Tadesse",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Technology",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "The real implications of politics in religious wedding and holidays",
      excerpt: "Analyzing the intersection of politics, religion, and cultural celebrations in Ethiopia.",
      image: "/placeholder.svg?height=300&width=500&text=Cultural+Politics",
      date: "May 20, 2023",
      author: {
        name: "Yonas Berhanu",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Culture",
      readTime: "9 min read",
    },
    {
      id: 6,
      title: "The Impact of Technology on the Ethiopian Tourism - How Technology is Changing",
      excerpt: "Examining the role of mobile apps and digital platforms in promoting Ethiopian tourism.",
      image: "/placeholder.svg?height=300&width=500&text=Mobile+Tourism",
      date: "June 8, 2023",
      author: {
        name: "Hanna Girma",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Technology",
      readTime: "4 min read",
    },
  ]

  const categories = ["All", "Culture", "Travel", "Technology", "Food", "History", "Adventure"]

  const categoryData = [
    { name: "Culture", count: 24, image: "/placeholder.svg?height=200&width=300&text=Culture" },
    { name: "Travel", count: 18, image: "/placeholder.svg?height=200&width=300&text=Travel" },
    { name: "Technology", count: 15, image: "/placeholder.svg?height=200&width=300&text=Technology" },
    { name: "Food", count: 12, image: "/placeholder.svg?height=200&width=300&text=Food" },
    { name: "History", count: 9, image: "/placeholder.svg?height=200&width=300&text=History" },
    { name: "Adventure", count: 7, image: "/placeholder.svg?height=200&width=300&text=Adventure" },
  ]

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
            <SearchFilter categories={categories} />
            <FeaturedPosts posts={featuredPosts} />
            <LatestPosts posts={posts} />
            <CreatePostCTA />
            <CategorySection categories={categoryData} />
            <Newsletter />
          </div>
        </Container>
      </main>
      <ScrollToTop />
    </div>
  )
}
