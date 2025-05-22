"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Loader2 } from "lucide-react"
import { getDestinations } from "@/app/actions/destination-actions"
import type { DestinationData } from "@/app/actions/destination-actions"

export function AITravelSection() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [destinations, setDestinations] = useState<DestinationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true)
      try {
        const result = await getDestinations()
        if (result.success && result.data) {
          // Take the first 4 destinations
          const selectedDestinations = result.data.slice(0, 4)
          setDestinations(selectedDestinations)
        }
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const handleTalkToAI = () => {
    setIsProcessing(true)
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/chatbot")
    }, 1500)
  }

  const handleDestinationClick = (id: string) => {
    router.push(`/destinations/${id}`)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Your Smart <span className="text-[#E91E63]">AI Travel</span> Companion:
            <br />
            Discover, Plan, and Explore Ethiopia Effortlessly!
          </h2>
          <p className="text-gray-600 mb-8">
            Let our AI chatbot guide you to the perfect destinations, estimate costs, and craft your ideal Ethiopian
            adventure—all in one place!
          </p>
          <button
            className={`relative bg-[#E91E63] text-white px-6 py-3 rounded-full hover:bg-[#D81B60] transition-colors ${isProcessing ? "cursor-wait" : ""}`}
            onClick={handleTalkToAI}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="opacity-0">Talk to AI</span>
                <Loader2 className="animate-spin h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </>
            ) : (
              "Talk to AI"
            )}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : destinations.length > 0 ? (
            destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                onClick={() => handleDestinationClick(destination.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative h-48">
                  <Image
                    src={destination.images?.[0] || "/placeholder.svg"}
                    alt={destination.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // If image fails to load, use placeholder
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium px-3 py-1 rounded-full bg-[#E91E63] text-sm">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm">{destination.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[#E91E63] font-bold">{destination.region}</span>
                    <span className="text-xs text-gray-500">{destination.city}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-500">No destinations available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
