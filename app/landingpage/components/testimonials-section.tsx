"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useInView } from "react-intersection-observer"

const testimonials = [
  {
    id: 1,
    name: "Eleanor Pena",
    country: "United Kingdom",
    avatar: "/placeholder.svg?height=50&width=50&text=Eleanor",
    rating: 5,
    text: "Extraordinary tour guide! They made our Ethiopian adventure unforgettable. The highlight was our time in the Omo Valley meeting indigenous tribes.",
  },
  {
    id: 2,
    name: "Robert Johnson",
    country: "United States",
    avatar: "/placeholder.svg?height=50&width=50&text=Robert",
    rating: 5,
    text: "The trip to Lalibela was life-changing. The rock-hewn churches are truly a wonder of the world. Our guide was knowledgeable and friendly.",
  },
  {
    id: 3,
    name: "Sophia Chen",
    country: "Canada",
    avatar: "/placeholder.svg?height=50&width=50&text=Sophia",
    rating: 4,
    text: "Ethiopia's coffee ceremony was a highlight! The cultural immersion and historical sites were amazing. Highly recommend this tour company.",
  },
]

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handlePrevious = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">TESTIMONIALS</div>
          <h2 className="text-3xl font-bold">
            Satisfied <span className="text-[#E91E63]">travellers</span> around the world
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          <motion.button
            className="hidden md:flex w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={handlePrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6 text-[#E91E63]" />
          </motion.button>

          <motion.div
            key={testimonials[currentTestimonial].id}
            className="bg-white p-6 rounded-lg shadow-md max-w-md mx-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start mb-4">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm">{testimonials[currentTestimonial].name}</h3>
                <p className="text-xs text-gray-500">{testimonials[currentTestimonial].country}</p>
                <div className="flex mt-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400" fill="currentColor" />
                  ))}
                  {[...Array(5 - testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star
                      key={i + testimonials[currentTestimonial].rating}
                      className="h-3 w-3 text-gray-300"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">"{testimonials[currentTestimonial].text}"</p>
          </motion.div>

          <motion.button
            className="hidden md:flex w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6 text-[#E91E63]" />
          </motion.button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentTestimonial === index ? "bg-[#E91E63]" : "bg-gray-300"
              } transition-colors`}
              onClick={() => setCurrentTestimonial(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
