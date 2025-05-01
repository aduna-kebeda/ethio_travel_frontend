import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">TESTIMONIALS</div>
          <h2 className="text-3xl font-bold">
            Satisfied <span className="text-[#E91E63]">travellers</span> around the world
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          <button className="hidden md:block w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
            <ChevronLeft className="h-6 w-6 text-[#E91E63]" />
          </button>

          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-4">
            <div className="flex items-start mb-4">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=50&width=50&text=Eleanor"
                    alt="Eleanor Pena"
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm">Eleanor Pena</h3>
                <p className="text-xs text-gray-500">United Kingdom</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              "Extraordinary tour guide! They made our Ethiopian adventure unforgettable. The highlight was our time in
              the Omo Valley meeting indigenous tribes."
            </p>
          </div>

          <button className="hidden md:block w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
            <ChevronRight className="h-6 w-6 text-[#E91E63]" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#E91E63]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  )
}
