"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react"

// Event types
type EventCategory = "Festival" | "Religious" | "Cultural" | "Music" | "Food" | "Historical" | "All"

interface Event {
  id: string
  title: string
  description: string
  shortDescription: string
  date: string
  endDate?: string
  time: string
  location: string
  category: EventCategory
  image: string
  historicalSignificance?: string
  featured?: boolean
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll use mock data
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Timkat (Epiphany)",
        shortDescription: "Ethiopia's vibrant celebration of the baptism of Jesus Christ",
        description:
          "Timkat is the Ethiopian Orthodox celebration of Epiphany. It commemorates the baptism of Jesus in the Jordan River and is one of Ethiopia's most colorful festivals. The celebration includes a procession of the Tabot (replica of the Ark of the Covenant) to a water source where the water is blessed and sprinkled on participants.\n\nThe festival begins on the eve of Timkat with colorful processions and ceremonies. Priests dressed in ceremonial robes carry the Tabots on their heads to a body of water where a prayer vigil takes place overnight. The following morning, the water is blessed and sprinkled on the participants, symbolically renewing their baptismal vows.\n\nTimkat is particularly spectacular in Gondar, where the ceremonies take place at the Fasilides Bath, a 17th-century structure built by Emperor Fasilides. The bath is filled with water for the occasion, and after the blessing, young men dive into the water to retrieve a cross thrown by a priest.",
        date: "2025-01-19",
        endDate: "2025-01-20",
        time: "All day",
        location: "Nationwide, especially Gondar and Lalibela",
        category: "Religious",
        image: "/placeholder.svg?height=600&width=800&text=Timkat+Festival",
        historicalSignificance:
          "Timkat has been celebrated in Ethiopia for centuries and is a UNESCO Intangible Cultural Heritage.",
        featured: true,
      },
      {
        id: "2",
        title: "Meskel Festival",
        shortDescription: "Commemorating the discovery of the True Cross",
        description:
          "Meskel celebrates the finding of the True Cross by Queen Helena (mother of Constantine the Great). The celebration includes the burning of a large bonfire called Demera, which is topped by a cross and surrounded by yellow Meskel daisies.",
        date: "2024-09-27",
        time: "Afternoon to evening",
        location: "Nationwide, especially Addis Ababa",
        category: "Religious",
        image: "/placeholder.svg?height=600&width=800&text=Meskel+Festival",
        historicalSignificance: "Meskel has been celebrated for over 1,600 years in Ethiopia.",
      },
      {
        id: "3",
        title: "Ethiopian New Year (Enkutatash)",
        shortDescription: "Ethiopian New Year celebrations with flowers and songs",
        description:
          "Enkutatash means 'gift of jewels' in Amharic. The celebration marks the end of the rainy season and the beginning of the Ethiopian New Year. Children dressed in new clothes dance through the streets while girls present songs and flowers.",
        date: "2024-09-11",
        time: "All day",
        location: "Nationwide",
        category: "Cultural",
        image: "/placeholder.svg?height=600&width=800&text=Ethiopian+New+Year",
        historicalSignificance:
          "The Ethiopian calendar is based on the ancient Coptic calendar and is approximately seven years and eight months behind the Gregorian calendar.",
      },
    ]

    // Find the event with the matching ID
    const foundEvent = mockEvents.find((e) => e.id === params.id)
    setEvent(foundEvent || null)

    // Find related events (same category)
    if (foundEvent) {
      const related = mockEvents.filter((e) => e.id !== params.id && e.category === foundEvent.category).slice(0, 3)
      setRelatedEvents(related)
    }

    setIsLoading(false)
  }, [params.id])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E63]"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events">
            <button className="bg-[#E91E63] text-white px-6 py-3 rounded-full hover:bg-[#D81B60]">
              Back to Events
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Event Hero */}
      <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `url('${event.image}')` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="max-w-3xl">
            <div className="inline-block bg-[#E91E63] text-white text-xs font-bold px-3 py-1 rounded mb-4">
              {event.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-white text-lg mb-6">{event.shortDescription}</p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <Calendar className="h-5 w-5 text-white mr-2" />
                <span className="text-white">
                  {formatDate(event.date)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </span>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <Clock className="h-5 w-5 text-white mr-2" />
                <span className="text-white">{event.time}</span>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <MapPin className="h-5 w-5 text-white mr-2" />
                <span className="text-white">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Link href="/events" className="inline-flex items-center text-[#E91E63] mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Events
              </Link>

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">About This Event</h2>

                {event.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))}

                {event.historicalSignificance && (
                  <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4">
                    <h3 className="font-bold mb-2">Historical Significance</h3>
                    <p className="text-gray-700">{event.historicalSignificance}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Location</h2>
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=800&text=Map+of+Event+Location"
                    alt="Event Location Map"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-gray-700">{event.location}</p>
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Share This Event</h2>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white p-2 rounded-full">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </button>
                  <button className="bg-blue-400 text-white p-2 rounded-full">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                    </svg>
                  </button>
                  <button className="bg-pink-600 text-white p-2 rounded-full">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </button>
                </div>
              </div>

              {relatedEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Related Events</h2>
                  <div className="space-y-4">
                    {relatedEvents.map((relatedEvent) => (
                      <Link href={`/events/${relatedEvent.id}`} key={relatedEvent.id}>
                        <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedEvent.image || "/placeholder.svg"}
                              alt={relatedEvent.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-sm">{relatedEvent.title}</h3>
                            <p className="text-xs text-gray-500">{formatDate(relatedEvent.date)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-bold mb-4">Plan Your Visit</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Interested in attending this event? Let our AI travel assistant help you plan your trip.
                </p>
                <Link href="/talk-to-ai">
                  <button className="w-full bg-[#E91E63] text-white px-4 py-2 rounded-full hover:bg-[#D81B60]">
                    Create Custom Itinerary
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
