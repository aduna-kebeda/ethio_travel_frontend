import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="relative h-[500px] bg-cover bg-center"
      style={{ backgroundImage: "url('/placeholder.svg?height=1000&width=2000&text=Discover+Ethiopia')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Discover Ethiopia's Wonders</h1>
        <p className="text-xl text-white mb-8 max-w-2xl">
          Explore ancient historical sites, breathtaking landscapes, and vibrant cultures
        </p>

        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                className="pl-10 bg-white/90 backdrop-blur-sm border-0 h-12 text-base"
              />
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 h-12">
              Search
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/destinations?category=Historical">
              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Historical Sites
              </Button>
            </Link>
            <Link href="/destinations?category=Natural">
              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Natural Wonders
              </Button>
            </Link>
            <Link href="/destinations?category=Cultural">
              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Cultural Experiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
