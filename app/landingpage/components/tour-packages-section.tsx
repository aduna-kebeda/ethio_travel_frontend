"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useInView } from "react-intersection-observer"

// Sample tour packages data
const tourPackages = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=400&text=Axum+Church",
    title: "Fall in love with Axum's ancient stone and timeless wonders.",
    location: "Axum, Tigray region",
    duration: "3 days and 2 nights tour",
    price: 100,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=400&text=Gondar+Castle",
    title: "Gondar is a place where magic becomes reality",
    location: "Gondar, Amhara region",
    duration: "5 days and 4 nights tour",
    price: 300,
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=400&text=Axum+Obelisk",
    title: "Fall in love with Axum's ancient stone and timeless wonders.",
    location: "Axum, Tigray region",
    duration: "3 days and 2 nights tour",
    price: 100,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=400&text=Lalibela",
    title: "You don't want to miss the 8th wonder of the world",
    location: "Lalibela, Amhara",
    duration: "4 days and 3 nights tour",
    price: 200,
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=400&text=Bale+Mountains",
    title: "Explore the breathtaking Bale Mountains National Park",
    location: "Bale, Oromia",
    duration: "6 days and 5 nights tour",
    price: 350,
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=400&text=Omo+Valley",
    title: "Discover the unique cultures of the Omo Valley",
    location: "Omo Valley, SNNPR",
    duration: "7 days and 6 nights tour",
    price: 400,
  },
]

export function TourPackagesSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const packagesPerPage = 4
  const totalPages = Math.ceil(tourPackages.length / packagesPerPage)
  const router = useRouter()

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  const handlePackageClick = (id: number) => {
    router.push(`/packages/${id}`)
  }

  const displayedPackages = tourPackages.slice(currentPage * packagesPerPage, (currentPage + 1) * packagesPerPage)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">TOUR PACKAGES</div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              The amazing places around <span className="text-[#E91E63]">Ethiopia</span>
            </h2>
            <div className="flex space-x-2">
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={handlePrevious}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="w-8 h-8 rounded-full bg-[#E91E63] text-white flex items-center justify-center hover:bg-[#D81B60] transition-colors"
                onClick={handleNext}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {displayedPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                onClick={() => handlePackageClick(pkg.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-48">
                  <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium px-3 py-1 rounded-full bg-[#E91E63] text-sm">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm">{pkg.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                    <span>{pkg.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#E91E63] font-bold">${pkg.price}</span>
                    <span className="text-xs text-gray-500">Per person</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentPage === index ? "bg-[#E91E63]" : "bg-gray-300"
                } transition-colors`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
