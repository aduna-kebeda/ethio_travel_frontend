import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="relative h-[400px] bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/wonchi.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Discover Ethiopia's Wonders</h1>
        <p className="text-xl text-white mb-8 max-w-2xl">
          Explore ancient historical sites, breathtaking landscapes, and vibrant cultures
        </p>

        
      </div>
    </section>
  )
}
