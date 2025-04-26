import Image from "next/image"

export function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">CATEGORY</div>
          <h2 className="text-3xl font-bold">We Offer Best Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Service 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/placeholder.svg?height=30&width=30&text=Tour" alt="Guided Tours" width={30} height={30} />
            </div>
            <h3 className="font-bold text-sm mb-2">Guided Tours</h3>
            <p className="text-xs text-gray-500">We'll complete every step of your travel with our expert guides.</p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/placeholder.svg?height=30&width=30&text=Business"
                alt="Local Business"
                width={30}
                height={30}
              />
            </div>
            <h3 className="font-bold text-sm mb-2">Local Business</h3>
            <p className="text-xs text-gray-500">We'll complete every step of your travel with our expert guides.</p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/placeholder.svg?height=30&width=30&text=Ethiopia"
                alt="Know Ethiopia"
                width={30}
                height={30}
              />
            </div>
            <h3 className="font-bold text-sm mb-2">Know Ethiopia</h3>
            <p className="text-xs text-gray-500">We'll complete every step of your travel with our expert guides.</p>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#E91E63] rounded-br-3xl"></div>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image
                src="/placeholder.svg?height=30&width=30&text=Religious"
                alt="Religious Tours"
                width={30}
                height={30}
              />
            </div>
            <h3 className="font-bold text-sm mb-2">Religious Tours</h3>
            <p className="text-xs text-gray-500">We'll complete every step of your travel with our expert guides.</p>
          </div>

          {/* Service 5 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/placeholder.svg?height=30&width=30&text=Blog" alt="Blog and News" width={30} height={30} />
            </div>
            <h3 className="font-bold text-sm mb-2">Blog and News</h3>
            <p className="text-xs text-gray-500">We'll complete every step of your travel with our expert guides.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
