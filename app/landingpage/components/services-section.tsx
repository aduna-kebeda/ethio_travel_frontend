"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const services = [
  {
    id: 1,
    icon: "/placeholder.svg?height=30&width=30&text=Tour",
    title: "Guided Tours",
    description: "Expert guides to lead you through Ethiopia's wonders.",
    bgColor: "bg-pink-100",
    link: "/packages?type=guided",
  },
  {
    id: 2,
    icon: "/placeholder.svg?height=30&width=30&text=Business",
    title: "Local Business",
    description: "Connect with authentic local businesses and experiences.",
    bgColor: "bg-blue-100",
    link: "/business",
  },
  {
    id: 3,
    icon: "/placeholder.svg?height=30&width=30&text=Ethiopia",
    title: "Know Ethiopia",
    description: "Learn about Ethiopia's rich history and diverse cultures.",
    bgColor: "bg-pink-100",
    link: "/about",
  },
  {
    id: 4,
    icon: "/placeholder.svg?height=30&width=30&text=Religious",
    title: "Religious Tours",
    description: "Explore Ethiopia's ancient religious sites and traditions.",
    bgColor: "bg-yellow-100",
    link: "/packages?type=religious",
  },
  {
    id: 5,
    icon: "/placeholder.svg?height=30&width=30&text=Blog",
    title: "Blog and News",
    description: "Stay updated with the latest travel tips and stories.",
    bgColor: "bg-green-100",
    link: "/blog",
  },
]

export function ServicesSection() {
  const router = useRouter()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleServiceClick = (link: string) => {
    router.push(link)
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
          <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">CATEGORY</div>
          <h2 className="text-3xl font-bold">We Offer Best Services</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`bg-white p-6 rounded-lg shadow-sm text-center relative cursor-pointer transform transition-all duration-300 hover:shadow-md`}
              onClick={() => handleServiceClick(service.link)}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className={`w-12 h-12 ${service.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image src={service.icon || "/placeholder.svg"} alt={service.title} width={30} height={30} />
              </motion.div>
              <h3 className="font-bold text-sm mb-2">{service.title}</h3>
              <p className="text-xs text-gray-500">{service.description}</p>
              {service.id === 3 && (
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#E91E63] rounded-br-3xl"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
