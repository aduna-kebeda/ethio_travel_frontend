import Link from "next/link"
import { getBlogPost } from "@/app/actions/blog-actions"
import { Button } from "@/components/ui/button"
import { Calendar, Facebook, Twitter, Instagram } from "lucide-react"

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // This would normally be fetched from an API based on the ID
  const post = await getBlogPost(Number.parseInt(params.id))

  const relatedPosts = [
    {
      id: 2,
      title: "The adventurous and diverse side of Ethiopia in the Eyes of Tourists",
      image: "/placeholder.svg?height=200&width=300&text=Ethiopia+Landscape",
      date: "February 10, 2023",
      author: {
        name: "Tigist Haile",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Travel",
    },
    {
      id: 3,
      title: "The Impact of Technology on the Ethiopian Tourism",
      image: "/placeholder.svg?height=200&width=300&text=Tech+Tourism",
      date: "March 5, 2023",
      author: {
        name: "Daniel Mekonnen",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Technology",
    },
    {
      id: 4,
      title: "The real implications of politics in religious wedding and holidays",
      image: "/placeholder.svg?height=200&width=300&text=Cultural+Politics",
      date: "May 20, 2023",
      author: {
        name: "Yonas Berhanu",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Culture",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary py-2 text-white text-center text-sm">
          <div className="container mx-auto px-4">
            <span>{post.category}</span>
          </div>
        </div>

        <article className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center mb-8">
                <div className="flex items-center mr-6">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={post.author.image || "/placeholder.svg"}
                      alt={post.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
              </div>

              <div className="mb-8">
                <img src={post.imageUrl || "/placeholder.svg"} alt={post.title} className="w-full h-auto rounded-lg" />
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                {post.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Culture", "Festival", "Economy", "Tourism", "Religion"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase()}`}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="border-t border-b py-6 my-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                      <img
                        src={post.author.image || "/placeholder.svg"}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{post.author.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Professional writer and blogger with a love for Ethiopian culture and traditions.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Blogs</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Link href={`/blog/${post.id}`} className="block">
                    <div className="relative h-48">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        {post.category}
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`/blog/${post.id}`} className="block">
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{post.title}</h3>
                    </Link>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                          <img
                            src={post.author.image || "/placeholder.svg"}
                            alt={post.author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
