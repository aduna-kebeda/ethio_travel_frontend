"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/destinations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleExploreClick = () => {
    router.push("/home");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              From <span className="text-[#E91E63]">Highlands</span> to{" "}
              <span className="relative">
                Heritage
                <span className="absolute -z-10 w-full h-8 bg-gray-200 rounded-full left-0 bottom-1 opacity-50"></span>
              </span>
              : <span>Explore</span> <span className="text-[#FFC107]">Ethiopia.</span>
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
              From the peaks of the Simien Mountains to the depths of the Danakil, Ethiopia is waiting for you.
            </p>

            <form onSubmit={handleSearch} className="flex items-center mb-6">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="pl-10 py-6 rounded-l-full border-r-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-r-full h-[42px]">
                <Search className="h-5 w-5" />
              </Button>
            </form>

            <Button
              onClick={handleExploreClick}
              className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-6 py-6 rounded-full"
            >
              Start Exploring
            </Button>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative flex justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <motion.div
                className="rounded-tl-[150px] rounded-tr-[150px] rounded-bl-[150px] rounded-br-[150px] overflow-hidden w-72 h-72 shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/bale.jpg"
                  alt="Ethiopian Landscape"
                  width={400}
                  height={400}
                  className="object-cover h-full w-full"
                />
              </motion.div>
              <motion.div
                className="absolute bottom-0 right-[-30px] rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] rounded-br-[60px] overflow-hidden w-32 h-40 border-4 border-white shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Image
                  src="/assets/gonder.jpg"
                  alt="Ethiopian Artifact"
                  width={150}
                  height={200}
                  className="object-cover h-full w-full"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}