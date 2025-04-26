import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  author: {
    name: string
    image: string
  }
  category: string
  readTime: string
}

interface PostCardProps {
  post: BlogPost
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-full">
      <Link href={`/blog/${post.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            {post.category}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/blog/${post.id}`} className="block">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full overflow-hidden mr-1 border border-gray-200">
              <img
                src={post.author.image || "/placeholder.svg"}
                alt={post.author.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readTime}
          </div>
        </div>
      </div>
    </article>
  )
}
