"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { getPackages } from "@/app/actions/package-actions"
import type { PackageData } from "@/app/actions/package-actions"

export function TourPackagesSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const [packages, setPackages] = useState<PackageData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const packagesPerPage = 4
  const totalPages = Math.ceil(packages.length / packagesPerPage)
  const router = useRouter()

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true)
      try {
        const data = await getPackages()
        setPackages(data)
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  const handlePackageClick = (id: number) => {
    router.push(`/packages/${id}`)
  }

  const displayedPackages = packages.slice(currentPage * packagesPerPage, (currentPage + 1) * packagesPerPage)

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
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : displayedPackages.length > 0 ? (
              displayedPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  onClick={() => handlePackageClick(pkg.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-48">
                    <Image
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium px-3 py-1 rounded-full bg-[#E91E63] text-sm">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm">{pkg.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                      <span>{pkg.location}, {pkg.region}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#E91E63] font-bold">
                        {pkg.discounted_price ? (
                          <>
                            <span className="line-through text-gray-500 mr-2">{pkg.price}</span>
                            {pkg.discounted_price}
                          </>
                        ) : (
                          pkg.price
                        )}
                      </span>
                      <span className="text-xs text-gray-500">Per person</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">No packages available at the moment.</p>
              </div>
            )}
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
