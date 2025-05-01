"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchModal } from "@/components/search-modal";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const router = useRouter();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType] = useState("Any");
  const [duration, setDuration] = useState("Any");

  const handleSearch = () => {
    // If destination is provided, navigate to search results
    if (destination.trim()) {
      router.push(
        `/packages?search=${encodeURIComponent(destination)}&type=${encodeURIComponent(
          travelType
        )}&duration=${encodeURIComponent(duration)}`
      );
    } else {
      // Otherwise open the search modal for more options
      setIsSearchModalOpen(true);
    }
  };

  return (
    <section
      className="relative h-[600px] md:h-[700px] bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/addis.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative container mx-auto px-4 h-full flex items-center justify-center"
      >
        <div className="max-w-xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block bg-[#E91E63] text-white text-xs font-bold px-3 py-1 rounded mb-4"
          >
            PLAN NOW
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
          >
            Get A Personalized trip
            <br />
            plan specifically tailored to your
            <br />
            interest by our AI
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg mb-6"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="flex items-center">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="w-full bg-transparent outline-none text-gray-600"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                <select
                  className="w-full bg-transparent outline-none text-gray-600 appearance-none cursor-pointer"
                  value={travelType}
                  onChange={(e) => setTravelType(e.target.value)}
                >
                  <option value="Any">Travel Type</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Family">Family</option>
                  <option value="Honeymoon">Honeymoon</option>
                </select>
              </div>
              <div className="w-full md:flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                <select
                  className="w-full bg-transparent outline-none text-gray-600 appearance-none cursor-pointer"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="Any">Duration</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="8-14 days">8-14 days</option>
                  <option value="15+ days">15+ days</option>
                </select>
              </div>
              <div className="w-full md:w-auto p-2">
                <button
                  className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white px-8 py-4 font-medium rounded-full transition-colors duration-300"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center"
          >
            <div className="flex -space-x-2 mr-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#E91E63" : "#3B82F6",
                    zIndex: 6 - i,
                  }}
                >
                  {i === 6 ? (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">+</div>
                  ) : (
                    <img
                      src={`/placeholder.svg?height=32&width=32&text=User${i}`}
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-white text-sm font-medium">
              <span className="font-bold">2,500 people booked</span> Tommorowland Event in last 24 hours
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-24 text-white text-sm hidden md:block"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center animate-pulse">
            <span>Scroll</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 right-24 flex space-x-2 hidden md:flex">
        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        <div className="w-8 h-1 bg-white rounded-full"></div>
        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        initialDestination={destination}
        initialTravelType={travelType}
        initialDuration={duration}
      />
    </section>
  );
};