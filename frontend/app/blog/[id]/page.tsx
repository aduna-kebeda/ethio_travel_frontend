import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBlogPost, getComments } from "@/app/actions/blog-actions";
import { Button } from "@/components/ui/button";
import { Calendar, Facebook, Twitter, Instagram } from "lucide-react";
import { AuthProvider } from "@/components/auth-provider"; // Added for comment authentication
import { CommentSection } from "../components/comment-section";

interface BlogPostPageProps {
  params: { id: string };
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  // Validate ID
  if (!/^\d+$/.test(params.id)) {
    notFound();
  }

  const postId = Number.parseInt(params.id);

  // Fetch blog post
  const post = await getBlogPost(postId);
  if (!post) {
    notFound();
  }

  // Fetch comments
  const commentsData = await getComments(postId);

  // Mock related posts (using imageUrl, avoiding ID conflict with postId)
  const relatedPosts = [
    {
      id: postId !== 6 ? 6 : 7, // Avoid ID conflict
      title: "The adventurous and diverse side of Ethiopia in the Eyes of Tourists",
      imageUrl: "/placeholder.svg?height=200&width=300&text=Ethiopia+Landscape",
      date: "February 10, 2023",
      author: {
        name: "Tigist Haile",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      category: "Travel",
    },
    {
      id: postId !== 7 ? 7 : 8,
      title: "The Impact of Technology on the Ethiopian Tourism",
      imageUrl: "/placeholder.svg?height=200&width=300&text=Tech+Tourism",
      date: "March 5, 2023",
      author: {
        name: "Daniel Mekonnen",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      category: "Technology",
    },
    {
      id: postId !== 8 ? 8 : 9,
      title: "The real implications of politics in religious wedding and holidays",
      imageUrl: "/placeholder.svg?height=200&width=300&text=Cultural+Politics",
      date: "May 20, 2023",
      author: {
        name: "Yonas Berhanu",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      category: "Culture",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary py-2 text-white text-center text-sm">
          <div className="container mx-auto px-4">
            <span>{post.status === "published" ? "Published" : "Draft"}</span>
          </div>
        </div>

        <article className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center mb-8">
                <div className="flex items-center mr-6">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt={`${post.authorName}'s avatar`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{post.authorName}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-8">
                <Image
                  src={post.imageUrl || "/placeholder.svg?height=400&width=800&text=Blog+Post+Image"}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg"
                  priority // Load main image above the fold
                />
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                {post.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag} // Fixed syntax error
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
                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4 bg-gray-200">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt={`${post.authorName}'s avatar`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{post.authorName}</h3>
                      <p className="text-gray-600 text-sm">
                        Professional writer and blogger with a love for Ethiopian culture and traditions.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Share on Facebook">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Share on Twitter">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Share on Instagram">
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <AuthProvider>
                <CommentSection postId={postId} initialComments={commentsData} />
              </AuthProvider>
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
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={300}
                        height={200}
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
                          <Image
                            src={post.author.imageUrl}
                            alt={`${post.author.name}'s avatar`}
                            width={24}
                            height={24}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
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
  );
}

export default function BlogPostPage(props: BlogPostPageProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <BlogPostContent {...props} />
    </Suspense>
  );
}