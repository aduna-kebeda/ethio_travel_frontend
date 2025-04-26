"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Music, Utensils, Landmark, Users, Award } from "lucide-react"
import { motion } from "framer-motion"

export const EventCategories = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const categories = [
    {
      id: "festival",
      name: "Festivals",
      icon: <Calendar className="h-8 w-8" />,
      description: "Experience Ethiopia's vibrant cultural celebrations",
      color: "bg-purple-500",
      hoverColor: "bg-purple-600",
    },
    {
      id: "religious",
      name: "Religious Events",
      icon: <Landmark className="h-8 w-8" />,
      description: "Witness ancient religious ceremonies and traditions",
      color: "bg-blue-500",
      hoverColor: "bg-blue-600",
    },
    {
      id: "cultural",
      name: "Cultural Events",
      icon: <Users className="h-8 w-8" />,
      description: "Immerse yourself in Ethiopia's diverse cultural heritage",
      color: "bg-green-500",
      hoverColor: "bg-green-600",
    },
    {
      id: "music",
      name: "Music Events",
      icon: <Music className="h-8 w-8" />,
      description: "Enjoy traditional and contemporary Ethiopian music",
      color: "bg-yellow-500",
      hoverColor: "bg-yellow-600",
    },
    {
      id: "food",
      name: "Food Festivals",
      icon: <Utensils className="h-8 w-8" />,
      description: "Taste the rich flavors of Ethiopian cuisine",
      color: "bg-red-500",
      hoverColor: "bg-red-600",
    },
    {
      id: "historical",
      name: "Historical Events",
      icon: <Award className="h-8 w-8" />,
      description: "Commemorate significant moments in Ethiopian history",
      color: "bg-indigo-500",
      hoverColor: "bg-indigo-600",
    },
  ]

  return (
    <section className="py-12 bg-gray-50 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Explore Events by Category</h2>
        <p className="text-gray-600 mb-10 max-w-3xl">
          Discover the rich tapestry of Ethiopian culture through our diverse event categories. From ancient religious
          ceremonies to vibrant music festivals, there's something for every traveler.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              href={`/events?category=${category.id}`}
              key={category.id}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="block h-full"
            >
              <motion.div
                initial={{ y: 10, opacity: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl p-6 text-white text-center transition-all duration-300 transform ${
                  hoveredCategory === category.id ? `${category.hoverColor} scale-105` : category.color
                } h-full flex flex-col items-center justify-center cursor-pointer shadow-md hover:shadow-lg`}
              >
                <div className="bg-white/20 p-4 rounded-full mb-4">{category.icon}</div>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-white/90">{category.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
