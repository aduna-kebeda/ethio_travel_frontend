import Image from "next/image"

export function AITravelSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Your Smart <span className="text-[#E91E63]">AI Travel</span> Companion:
            <br />
            Discover, Plan, and Explore Ethiopia Effortlessly!
          </h2>
          <p className="text-gray-600 mb-8">
            Let our AI chatbot guide you to the perfect destinations, estimate costs, and craft your ideal Ethiopian
            adventure—all in one place!
          </p>
          <button className="bg-[#E91E63] text-white px-6 py-3 rounded-full hover:bg-[#D81B60]">Talk to AI</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {/* Destination 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Danakil+Depression"
                alt="Afar, Danakil"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Afar, Danakil</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#E91E63] font-bold">$150</span>
                <span className="text-xs text-gray-500">3 days tour</span>
              </div>
            </div>
          </div>

          {/* Destination 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Harar"
                alt="Harar, Ethiopia"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Harar, Ethiopia</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#E91E63] font-bold">$120</span>
                <span className="text-xs text-gray-500">2 days tour</span>
              </div>
            </div>
          </div>

          {/* Destination 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Sodo"
                alt="Sodo, Omo"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Sodo, Omo</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#E91E63] font-bold">$200</span>
                <span className="text-xs text-gray-500">4 days tour</span>
              </div>
            </div>
          </div>

          {/* Destination 4 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Hamer+Omo"
                alt="Hamer, Omo"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">Hamer, Omo</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#E91E63] font-bold">$180</span>
                <span className="text-xs text-gray-500">3 days tour</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
