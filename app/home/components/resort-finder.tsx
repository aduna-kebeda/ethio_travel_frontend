"use client"

import { default as NextImage } from "next/image"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export const ResortFinder = () => {
  const router = useRouter()

  const handleStepClick = (step: number) => {
    if (step === 1) {
      router.push("/destinations")
    } else if (step === 2) {
      router.push("/packages")
    } else if (step === 3) {
      router.push("/business?category=resorts")
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <div className="text-[#E91E63] text-sm font-medium mb-2">Fast & Easy</div>
            <h2 className="text-2xl font-bold mb-6 text-[#0D2B3E]">Get the best resort in your destination</h2>

            <div className="space-y-6 mt-8">
              <motion.div
                className="flex items-start cursor-pointer group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleStepClick(1)}
              >
                <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1 group-hover:text-[#E91E63] transition-colors duration-300">
                    Choose Destination
                  </h3>
                  <p className="text-sm text-gray-600">
                    Browse our curated selection of Ethiopian destinations and find the perfect location for your stay.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start cursor-pointer group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleStepClick(2)}
              >
                <div className="bg-[#E91E63] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1 group-hover:text-[#E91E63] transition-colors duration-300">
                    Check Availability
                  </h3>
                  <p className="text-sm text-gray-600">
                    View resort details, check room availability, and compare prices for your preferred dates.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start cursor-pointer group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleStepClick(3)}
              >
                <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1 group-hover:text-[#E91E63] transition-colors duration-300">
                    Contact the resort
                  </h3>
                  <p className="text-sm text-gray-600">
                    Book directly with the resort or through our platform for a seamless experience. Our partner resorts
                    offer exclusive deals for EthioTravel customers.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 md:pl-8"
          >
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                  <NextImage
                    src="/placeholder.svg?height=300&width=400&text=Resort"
                    alt="Resort"
                    width={400}
                    height={300}
                    className="w-full h-auto shadow-lg"
                  />
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute -right-10 top-10 w-32 h-auto"
                >
                  <NextImage
                    src="/placeholder.svg?height=200&width=200&text=Airplane"
                    alt="Airplane"
                    width={200}
                    height={200}
                    className="animate-pulse"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg w-64 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <NextImage
                      src="/placeholder.svg?height=40&width=40&text=User"
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Trip to Harar</h4>
                    <p className="text-xs text-gray-500">by Anna Kowalczyk</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>4.8</span>
                  </div>
                  <div>40 people are interested</div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
