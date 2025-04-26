import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Container } from "@/components/container"

export default function AboutPage() {
  return (
    <div className="min-h-screen  bg-white">
      <Container className="py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section
            className="relative h-[400px] bg-cover bg-center"
            style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600&text=Addis+Ababa+Night')" }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
              <h1 className="text-5xl font-bold text-white italic">About Us</h1>
            </div>
          </section>

          {/* About Us Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <div className="text-[#E91E63] text-sm font-medium mb-2">Why EthioTravel</div>
                  <h2 className="text-3xl font-bold mb-6">We Provide You Best Information in the wonder of Ethiopia</h2>
                  <p className="text-gray-600 mb-8">
                    EthioTravel was founded with a mission to showcase the incredible diversity and beauty of Ethiopia
                    to travelers from around the world. We believe that Ethiopia's rich cultural heritage, stunning
                    landscapes, and warm hospitality deserve to be experienced by more people.
                  </p>
                  <Link
                    href="/packages"
                    className="inline-block bg-[#E91E63] text-white px-6 py-3 rounded-full hover:bg-[#D81B60] transition-colors"
                  >
                    View Package
                  </Link>
                </div>
                <div className="md:w-1/2 md:pl-12 relative">
                  <div className="rounded-full overflow-hidden w-64 h-64 mx-auto">
                    <Image
                      src="/placeholder.svg?height=400&width=400&text=Ethiopian+Woman"
                      alt="Ethiopian Woman"
                      width={400}
                      height={400}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=800&width=1600&text=Ethiopia+Landscape"
                  alt="Ethiopia Landscape"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white italic mb-4">want to discover</h2>
                    <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                      <Play className="h-12 w-12 text-white" fill="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src="/placeholder.svg?height=800&width=800&text=Ethiopian+Cultural+Dance"
                      alt="Ethiopian Cultural Dance"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="text-[#E91E63] text-sm font-medium mb-2">OFFER</div>
                  <h2 className="text-3xl font-bold mb-6">What We offer</h2>
                  <p className="text-gray-600 mb-8">
                    At EthioTravel, we're dedicated to providing exceptional travel experiences in Ethiopia. Our team of
                    local experts crafts personalized itineraries that showcase the country's rich cultural heritage,
                    stunning landscapes, and authentic encounters with local communities.
                  </p>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#E91E63] border-opacity-20"></div>
                        <div
                          className="absolute inset-0 rounded-full border-4 border-[#E91E63] border-l-transparent"
                          style={{ transform: "rotate(45deg)" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[#E91E63] font-bold">100%</span>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm uppercase">INFORMATION</h3>
                    </div>

                    <div className="text-center">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#E91E63] border-opacity-20"></div>
                        <div
                          className="absolute inset-0 rounded-full border-4 border-[#E91E63] border-l-transparent border-b-transparent"
                          style={{ transform: "rotate(45deg)" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[#E91E63] font-bold">75%</span>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm uppercase">CONNECTION</h3>
                    </div>

                    <div className="text-center">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#E91E63] border-opacity-20"></div>
                        <div
                          className="absolute inset-0 rounded-full border-4 border-[#E91E63] border-r-transparent border-t-transparent border-l-transparent"
                          style={{ transform: "rotate(45deg)" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[#E91E63] font-bold">85%</span>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm uppercase">GUIDANCE</h3>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="#" className="text-[#E91E63] font-medium hover:underline">
                      Explore more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hiker Destinations */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Hiker Destinations</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Blue Nile Falls", price: "$120" },
                  { name: "Lalibela", price: "$180" },
                  { name: "Danakil Depression", price: "$220" },
                  { name: "Simien Mountains", price: "$150" },
                  { name: "Omo Valley", price: "$190" },
                  { name: "Gondar Castles", price: "$140" },
                  { name: "Bale Mountains", price: "$170" },
                  { name: "Awash National Park", price: "$130" },
                  { name: "Harar", price: "$160" },
                  { name: "Lake Tana", price: "$110" },
                  { name: "Semien Mountains", price: "$200" },
                  { name: "Tigray Churches", price: "$210" },
                ].map((destination, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={`/placeholder.svg?height=300&width=400&text=${destination.name.replace(" ", "+")}`}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium text-sm">{destination.name}</h3>
                      <p className="text-white text-xs">{destination.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="text-[#E91E63] text-sm font-medium uppercase mb-2">TESTIMONIAL</div>
                <h2 className="text-3xl font-bold">See What Our Clients Say About Us</h2>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 relative">
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                      <Image
                        src="/placeholder.svg?height=100&width=100&text=Client"
                        alt="Client"
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-10">
                    <p className="text-gray-600 italic mb-6">
                      "EthioTravel made my trip to Ethiopia unforgettable! Their local guides were knowledgeable and
                      friendly, showing me hidden gems I would never have found on my own. The itinerary was perfectly
                      balanced, and the accommodations were excellent. I'll definitely be using their services again for
                      my next adventure!"
                    </p>
                    <h3 className="font-bold">Christina Mekonnen</h3>
                    <p className="text-sm text-gray-500">Designer</p>
                  </div>

                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                      <button className="w-2 h-2 rounded-full bg-gray-300"></button>
                      <button className="w-2 h-2 rounded-full bg-[#E91E63]"></button>
                      <button className="w-2 h-2 rounded-full bg-gray-300"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
}
