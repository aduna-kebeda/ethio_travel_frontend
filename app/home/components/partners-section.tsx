"use client"

import { default as NextImage } from "next/image"
import { motion } from "framer-motion"

export const PartnersSection = () => {
  const partners = [
    { name: "Emirates", logo: "/placeholder.svg?height=40&width=120&text=Emirates" },
    { name: "Trivago", logo: "/placeholder.svg?height=40&width=120&text=Trivago" },
    { name: "Airbnb", logo: "/placeholder.svg?height=40&width=120&text=Airbnb" },
    { name: "Turkish Airlines", logo: "/placeholder.svg?height=40&width=120&text=Turkish+Airlines" },
  ]

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-center text-gray-500 mb-6 text-sm uppercase tracking-wider">Our Trusted Partners</h3>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <NextImage
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
