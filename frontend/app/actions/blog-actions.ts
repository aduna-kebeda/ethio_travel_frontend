"use server"

// This is a mock implementation. In a real app, this would interact with a database.

interface BlogPostData {
  title: string
  excerpt: string
  content: string
  category: string
  imageUrl: string
}

export async function createBlogPost(data: BlogPostData) {
  // In a real app, this would save the data to a database
  console.log("Creating blog post:", data)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return a mock response
  return {
    id: Math.floor(Math.random() * 1000),
    ...data,
    date: new Date().toISOString(),
    status: "published",
  }
}

export async function updateBlogPost(id: number, data: BlogPostData) {
  // In a real app, this would update the data in a database
  console.log("Updating blog post:", id, data)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return a mock response
  return {
    id,
    ...data,
    date: new Date().toISOString(),
    status: "published",
  }
}

export async function deleteBlogPost(id: number) {
  // In a real app, this would delete the post from a database
  console.log("Deleting blog post:", id)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

export async function getBlogPosts() {
  // In a real app, this would fetch posts from a database

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: 1,
      title: "My Journey Through the Simien Mountains",
      excerpt: "A personal account of trekking through Ethiopia's breathtaking mountain range.",
      image: "/placeholder.svg?height=300&width=500&text=Simien+Mountains",
      date: "March 15, 2023",
      status: "published",
      views: 245,
      comments: 12,
      author: {
        name: "John Doe",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Adventure",
      readTime: "8 min read",
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
      author: {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Culture",
      readTime: "6 min read",
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
      author: {
        name: "Michael Brown",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Travel",
      readTime: "5 min read",
    },
  ]
}

export async function getBlogPost(id: number) {
  // In a real app, this would fetch a specific post from a database

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return {
    id: id,
    title: "My Journey Through the Simien Mountains",
    excerpt: "A personal account of trekking through Ethiopia's breathtaking mountain range.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc, quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    category: "adventure",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Simien+Mountains",
    date: "March 15, 2023",
    status: "published",
    views: 245,
    comments: 12,
    author: {
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
  }
}

export async function getFeaturedBlogPosts() {
  // In a real app, this would fetch featured posts from a database

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: 1,
      title: "The impact of Timket or epiphany holiday in shaping ethiopian economy",
      excerpt:
        "Exploring Ethiopia's rich tapestry of traditions and festivals, we delve into the profound impact of Timket on the country's cultural heritage and economic landscape.",
      image: "/assets/timket.jpg",
      date: "January 15, 2023",
      author: {
        name: "Abebe Kebede",
        image: "/placeholder.svg?height=40&width=40",
      },
      category: "Culture",
      readTime: "8 min read",
    },
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
}

export async function getBlogCategories() {
  // In a real app, this would fetch categories from a database

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    { name: "All", count: 42 },
    { name: "Culture", count: 24 },
    { name: "Travel", count: 18 },
    { name: "Technology", count: 15 },
    { name: "Food", count: 12 },
    { name: "History", count: 9 },
    { name: "Adventure", count: 7 },
  ]
}
