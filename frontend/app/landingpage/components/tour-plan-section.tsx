"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function TourPlanSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <motion.div
          ref={ref}
          className="flex flex-col md:flex-row items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left Image Section */}
          <motion.div className="md:w-1/2 mb-8 md:mb-0" variants={itemVariants}>
            <div className="relative">
              <motion.div
                className="rounded-full overflow-hidden w-64 h-64 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/wonchi.jpg"
                  alt="Sunset View"
                  width={400}
                  height={400}
                  className="object-cover h-full w-full"
                />
              </motion.div>
              <motion.div
                className="absolute bottom-[-40px] right-[-40px] rounded-full overflow-hidden w-48 h-48 border-4 border-white shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/axum.jpg"
                  alt="City Night"
                  width={300}
                  height={300}
                  className="object-cover h-full w-full"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Text Section */}
          <motion.div className="md:w-1/2 md:pl-12" variants={itemVariants}>
            <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">ABOUT US</div>
            <h2 className="text-3xl font-bold mb-4">
              Our tour plan is to fulfil your <span className="text-[#E91E63]">dream wish</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Understand to achieve anything requires faith and belief in yourself, vision, hard work, determination,
              and dedication. We're here to make your Ethiopian adventure unforgettable.
            </p>

            {/* Stats Section */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" variants={containerVariants}>
              <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <h3 className="text-2xl font-bold text-[#E91E63]">15</h3>
                <p className="text-xs text-gray-500">
                  Years of
                  <br />
                  Experience
                </p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <h3 className="text-2xl font-bold text-[#E91E63]">1k</h3>
                <p className="text-xs text-gray-500">
                  Successful
                  <br />
                  Trips
                </p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <h3 className="text-2xl font-bold text-[#E91E63]">20k</h3>
                <p className="text-xs text-gray-500">
                  Happy
                  <br />
                  Customers
                </p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <h3 className="text-2xl font-bold text-[#E91E63]">4.9</h3>
                <p className="text-xs text-gray-500">
                  Overall
                  <br />
                  Rating
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}