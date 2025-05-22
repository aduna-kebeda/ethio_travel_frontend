import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/assets/bishoftu.jpg" alt="Ethiopian Businesses" fill className="object-cover" priority />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')] opacity-10" />
      </div>

      <Container className="relative h-full flex flex-col justify-center items-center text-center z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg max-w-3xl">
          Discover Ethiopian Businesses
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl drop-shadow">
          Find the best local businesses, restaurants, hotels, and services across Ethiopia
        </p>

        <div className="w-full max-w-2xl backdrop-blur-sm bg-white/10 rounded-lg p-2 shadow-xl">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for businesses..."
                className="pl-10 bg-white/90 border-0 h-12 text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary"
              />
            </div>
            <Button className="h-12 px-6 bg-primary rounded-r-full hover:bg-primary/90 text-white">Search</Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
            >
              Hotels
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
            >
              Restaurants
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
            >
              Tour Operators
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
            >
              Shops
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
