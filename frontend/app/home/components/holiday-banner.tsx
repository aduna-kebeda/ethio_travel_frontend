"use client"

import { default as NextImage } from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export const HolidayBanner = () => {
  const router = useRouter()

  const handleBannerClick = () => {
    router.push("/packages?category=holiday")
  }

  return (
    <section
      className="relative h-[300px] bg-cover bg-center cursor-pointer overflow-hidden"
      onClick={handleBannerClick}
    >
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
        <NextImage
          src="/assets/irecha2.jpg"
          alt="Ethiopian Woman"
          fill
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative container mx-auto px-4 h-full flex items-center"
      >
        <div className="max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Let's make your next holiday amazing
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="h-1 bg-white mb-4"
          ></motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 bg-[#E91E63] text-white px-6 py-2 rounded-full hover:bg-[#D81B60] transform hover:scale-105 transition-all duration-300"
          >
            Explore Holiday Packages
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
