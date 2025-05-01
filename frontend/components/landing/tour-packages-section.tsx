import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function TourPackagesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">TOUR PACKAGES</div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            The amazing places around <span className="text-[#E91E63]">Ethiopia</span>
          </h2>
          <div className="flex space-x-2">
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#E91E63] text-white flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Package 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Axum+Church"
                alt="Axum Church"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Fall in love with Axum's ancient stone and timeless wonders.</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                <span>Axum, Tigray region</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span>3 days and 2 nights tour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#E91E63] font-bold">$100</span>
                <span className="text-xs text-gray-500">Per person</span>
              </div>
            </div>
          </div>

          {/* Package 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Gondar+Castle"
                alt="Gondar Castle"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Gondar is a place where magic becomes reality</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                <span>Gondar, Amhara region</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span>5 days and 4 nights tour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#E91E63] font-bold">$300</span>
                <span className="text-xs text-gray-500">Per person</span>
              </div>
            </div>
          </div>

          {/* Package 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Axum+Obelisk"
                alt="Axum Obelisk"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Fall in love with Axum's ancient stone and timeless wonders.</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                <span>Axum, Tigray region</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span>3 days and 2 nights tour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#E91E63] font-bold">$100</span>
                <span className="text-xs text-gray-500">Per person</span>
              </div>
            </div>
          </div>

          {/* Package 4 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Lalibela"
                alt="Lalibela"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">You don't want to miss the 8th wonder of the world</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                <span>Lalibela, Amhara</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span>4 days and 3 nights tour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#E91E63] font-bold">$200</span>
                <span className="text-xs text-gray-500">Per person</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
