"use client"
import { Clock, Users, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

interface PackageCardProps {
  id: string
  title: string
  location: string
  price: string
  image: string
  days: number
  people: number
  description: string
}

export const PackageCard = ({ id, title, location, price, image, days, people, description }: PackageCardProps) => {
  const [imageError, setImageError] = useState(false)
  const imageSrc = !imageError && image ? image : "/placeholder.svg"

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-[#E91E63]">
          {price}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">{days} days</span>
            <Users className="h-4 w-4 text-gray-400 ml-2" />
            <span className="text-xs text-gray-500">{people} people going</span>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
            ))}
          </div>
        </div>
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">{location}</span>
        </div>
        <h3 className="font-bold text-lg mb-2 hover:text-[#E91E63] transition-colors">{title}</h3>
        <p className="text-xs text-gray-600 mb-4 flex-1">{description}</p>
        <Link href={`/packages/${id}`} className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#E91E63] text-white px-4 py-2 rounded-full text-sm hover:bg-[#D81B60] w-full transition-colors"
          >
            Explore Now
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
