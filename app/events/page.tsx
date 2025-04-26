"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { HeroSection } from "./components/hero-section"
import { SearchFilter } from "./components/search-filter"
import { FeaturedEvents } from "./components/featured-events"
import { CalendarView } from "./components/calendar-view"
import { UpcomingEvents } from "./components/upcoming-events"
import { AllEvents } from "./components/all-events"
import { EventCategories } from "./components/event-categories"
import { PlanYourTrip } from "./components/plan-your-trip"
import { SubscribeModal } from "./components/subscribe-modal"
import { AddEventCTA } from "./components/add-event-cta"
import { EventsMap } from "./components/events-map"
import { Button } from "@/components/ui/button"
import { Calendar, List, MapPin } from "lucide-react"
import { useSession } from "next-auth/react"
import type { Event, EventCategory } from "./types"

// Event types
// type EventCategory = "Festival" | "Religious" | "Cultural" | "Music" | "Food" | "Historical" | "All"

// interface Event {
//   id: string
//   title: string
//   description: string
//   shortDescription: string
//   date: string
//   endDate?: string
//   time: string
//   location: string
//   category: EventCategory
//   image: string
//   historicalSignificance?: string
//   featured?: boolean
// }

export default function EventsPage() {
  // Auth state
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("All")
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [subscribedCategories, setSubscribedCategories] = useState<EventCategory[]>([])
  const [email, setEmail] = useState("")
  const [currentView, setCurrentView] = useState<"calendar" | "list" | "map">("list")
  const [isLoading, setIsLoading] = useState(true)

  // Sample events data
  const events: Event[] = [
    {
      id: "1",
      title: "Timkat (Epiphany)",
      shortDescription: "Ethiopia's vibrant celebration of the baptism of Jesus Christ",
      description:
        "Timkat is the Ethiopian Orthodox celebration of Epiphany. It commemorates the baptism of Jesus in the Jordan River and is one of Ethiopia's most colorful festivals. The celebration includes a procession of the Tabot (replica of the Ark of the Covenant) to a water source where the water is blessed and sprinkled on participants.",
      date: "2025-01-19",
      endDate: "2025-01-20",
      time: "All day",
      location: "Nationwide, especially Gondar and Lalibela",
      coordinates: { lat: 12.603, lng: 37.4684 }, // Gondar coordinates
      category: "Religious",
      image: "/placeholder.svg?height=600&width=800&text=Timkat+Festival",
      historicalSignificance:
        "Timkat has been celebrated in Ethiopia for centuries and is a UNESCO Intangible Cultural Heritage.",
      featured: true,
      organizer: "Ethiopian Orthodox Church",
      ticketPrice: "Free",
      website: "https://example.com/timkat",
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
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Religious",
      image: "/placeholder.svg?height=600&width=800&text=Meskel+Festival",
      historicalSignificance: "Meskel has been celebrated for over 1,600 years in Ethiopia.",
      organizer: "Ethiopian Orthodox Church",
      ticketPrice: "Free",
      website: "https://example.com/meskel",
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
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Cultural",
      image: "/placeholder.svg?height=600&width=800&text=Ethiopian+New+Year",
      historicalSignificance:
        "The Ethiopian calendar is based on the ancient Coptic calendar and is approximately seven years and eight months behind the Gregorian calendar.",
      organizer: "Various local communities",
      ticketPrice: "Free",
      website: "https://example.com/enkutatash",
    },
    {
      id: "4",
      title: "Irreecha Festival",
      shortDescription: "Oromo thanksgiving celebration at Lake Hora",
      description:
        "Irreecha is the thanksgiving festival of the Oromo people. It's celebrated at Lake Hora in Bishoftu to thank Waaqa (God) for the blessings received throughout the year and to welcome the new harvest season.",
      date: "2024-10-06",
      time: "Morning to evening",
      location: "Bishoftu (Debre Zeit)",
      coordinates: { lat: 8.7515, lng: 38.9955 }, // Bishoftu coordinates
      category: "Cultural",
      image: "/placeholder.svg?height=600&width=800&text=Irreecha+Festival",
      historicalSignificance:
        "Irreecha has been celebrated for centuries and is a vital part of Oromo cultural identity.",
      organizer: "Oromo Cultural Center",
      ticketPrice: "Free",
      website: "https://example.com/irreecha",
    },
    {
      id: "5",
      title: "Adwa Victory Day",
      shortDescription: "Commemorating Ethiopia's historic victory against Italian forces",
      description:
        "Adwa Victory Day commemorates Ethiopia's decisive victory against Italian forces at the Battle of Adwa in 1896. This victory secured Ethiopia's independence and made it the only African nation to successfully resist European colonization.",
      date: "2025-03-02",
      time: "Morning",
      location: "Nationwide, especially Adwa",
      coordinates: { lat: 14.1702, lng: 38.8959 }, // Adwa coordinates
      category: "Historical",
      image: "/placeholder.svg?height=600&width=800&text=Adwa+Victory+Day",
      historicalSignificance:
        "The Battle of Adwa is considered one of the most significant events in Ethiopian history and a symbol of African resistance against colonialism.",
      organizer: "Ministry of Culture and Tourism",
      ticketPrice: "Free",
      website: "https://example.com/adwa",
    },
    {
      id: "6",
      title: "Kulubi Gabriel Celebration",
      shortDescription: "Major religious pilgrimage to Kulubi",
      description:
        "Twice a year, thousands of pilgrims trek to Kulubi to celebrate the feast of St. Gabriel. The celebration includes prayers, feasting, and spiritual ceremonies.",
      date: "2024-12-28",
      time: "All day",
      location: "Kulubi, Eastern Ethiopia",
      coordinates: { lat: 9.4092, lng: 41.713 }, // Approximate Kulubi coordinates
      category: "Religious",
      image: "/placeholder.svg?height=600&width=800&text=Kulubi+Gabriel",
      historicalSignificance:
        "The Kulubi Gabriel Church was built in the 1880s and has been an important pilgrimage site since then.",
      organizer: "Ethiopian Orthodox Church",
      ticketPrice: "Free",
      website: "https://example.com/kulubi",
    },
    {
      id: "7",
      title: "Ashenda",
      shortDescription: "Girls' festival celebrating the end of fasting",
      description:
        "Ashenda is a festival where young girls and women dress in traditional clothes, sing, and dance through villages and towns. It celebrates the end of a two-week fasting period honoring the Virgin Mary.",
      date: "2024-08-22",
      endDate: "2024-08-25",
      time: "All day",
      location: "Tigray and Amhara regions",
      coordinates: { lat: 13.4966, lng: 39.4664 }, // Mekelle coordinates (Tigray)
      category: "Cultural",
      image: "/placeholder.svg?height=600&width=800&text=Ashenda+Festival",
      historicalSignificance:
        "Ashenda has been celebrated for generations and plays an important role in preserving cultural heritage.",
      organizer: "Local communities in Tigray and Amhara",
      ticketPrice: "Free",
      website: "https://example.com/ashenda",
    },
    {
      id: "8",
      title: "Ethiopian Christmas (Genna)",
      shortDescription: "Ethiopian Orthodox Christmas celebrations",
      description:
        "Genna is the Ethiopian Christmas, celebrated on January 7th according to the Ethiopian calendar. The day begins with early morning church services, followed by traditional games and feasting.",
      date: "2025-01-07",
      time: "All day",
      location: "Nationwide",
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Religious",
      image: "/placeholder.svg?height=600&width=800&text=Ethiopian+Christmas",
      historicalSignificance:
        "Genna has been celebrated in Ethiopia since Christianity was introduced in the 4th century.",
      organizer: "Ethiopian Orthodox Church",
      ticketPrice: "Free",
      website: "https://example.com/genna",
    },
    {
      id: "9",
      title: "Addis Ababa International Film Festival",
      shortDescription: "Showcasing Ethiopian and international cinema",
      description:
        "The Addis Ababa International Film Festival brings together filmmakers from Ethiopia and around the world. The festival includes screenings, workshops, and networking events for film professionals.",
      date: "2024-11-15",
      endDate: "2024-11-22",
      time: "Various times",
      location: "Addis Ababa",
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Cultural",
      image: "/placeholder.svg?height=600&width=800&text=Addis+Film+Festival",
      organizer: "Ethiopian Film Association",
      ticketPrice: "200-500 ETB",
      website: "https://example.com/filmfestival",
    },
    {
      id: "10",
      title: "Yekatit 12 (Martyrs' Day)",
      shortDescription: "Remembering victims of the 1937 Addis Ababa massacre",
      description:
        "Yekatit 12 commemorates the victims of the massacre carried out by Italian forces in Addis Ababa in 1937. The day includes memorial services and educational events about this tragic historical event.",
      date: "2025-02-19",
      time: "Morning",
      location: "Addis Ababa",
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Historical",
      image: "/placeholder.svg?height=600&width=800&text=Yekatit+12",
      historicalSignificance:
        "This day remembers the thousands of Ethiopians who were killed during the Italian occupation.",
      organizer: "Ministry of Culture and Tourism",
      ticketPrice: "Free",
      website: "https://example.com/yekatit12",
    },
    {
      id: "11",
      title: "Ethiopian Easter (Fasika)",
      shortDescription: "The most important holiday in the Ethiopian Orthodox calendar",
      description:
        "Fasika follows a 55-day fasting period during which no animal products are consumed. The celebration begins with an overnight vigil that ends around 3:00 AM, when everyone breaks their fast and celebrates the resurrection.",
      date: "2025-04-20",
      time: "All day",
      location: "Nationwide",
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Religious",
      image: "/placeholder.svg?height=600&width=800&text=Ethiopian+Easter",
      historicalSignificance:
        "Fasika has been celebrated since Christianity became the state religion in the 4th century.",
      organizer: "Ethiopian Orthodox Church",
      ticketPrice: "Free",
      website: "https://example.com/fasika",
    },
    {
      id: "12",
      title: "Selale Cultural Festival",
      shortDescription: "Celebrating the culture and traditions of the Selale Oromo",
      description:
        "The Selale Cultural Festival showcases the unique culture, music, dance, and traditions of the Selale Oromo people. The festival includes horse parades, traditional music performances, and cultural exhibitions.",
      date: "2024-10-12",
      endDate: "2024-10-13",
      time: "All day",
      location: "Fiche, North Shewa",
      coordinates: { lat: 9.8, lng: 38.7333 }, // Fiche coordinates
      category: "Cultural",
      image: "/placeholder.svg?height=600&width=800&text=Selale+Festival",
      organizer: "Selale Cultural Association",
      ticketPrice: "100 ETB",
      website: "https://example.com/selale",
    },
    {
      id: "13",
      title: "Harar Coffee Festival",
      shortDescription: "Celebrating Ethiopia's coffee heritage in the ancient city of Harar",
      description:
        "The Harar Coffee Festival celebrates the rich coffee culture of Ethiopia, particularly the unique Harar coffee variety. The festival includes coffee ceremonies, tasting sessions, cultural performances, and educational workshops about coffee production.",
      date: "2024-10-25",
      endDate: "2024-10-27",
      time: "9:00 AM - 8:00 PM",
      location: "Harar",
      coordinates: { lat: 9.3131, lng: 42.1147 }, // Harar coordinates
      category: "Food",
      image: "/placeholder.svg?height=600&width=800&text=Harar+Coffee+Festival",
      organizer: "Harar Coffee Association",
      ticketPrice: "150 ETB",
      website: "https://example.com/hararcoffee",
      featured: true,
    },
    {
      id: "14",
      title: "Addis Ababa Jazz Festival",
      shortDescription: "International jazz festival featuring Ethiopian and global artists",
      description:
        "The Addis Ababa Jazz Festival brings together renowned jazz musicians from Ethiopia and around the world. The festival celebrates Ethiopia's rich musical heritage and its influence on global jazz, featuring performances, workshops, and jam sessions.",
      date: "2024-12-05",
      endDate: "2024-12-08",
      time: "6:00 PM - 11:00 PM",
      location: "Multiple venues in Addis Ababa",
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Music",
      image: "/placeholder.svg?height=600&width=800&text=Addis+Jazz+Festival",
      organizer: "Ethiopian Jazz Association",
      ticketPrice: "300-800 ETB",
      website: "https://example.com/jazzfestival",
      featured: true,
    },
    {
      id: "15",
      title: "Great Ethiopian Run",
      shortDescription: "Africa's biggest road race through the streets of Addis Ababa",
      description:
        "The Great Ethiopian Run is an annual 10-kilometer road running event held in Addis Ababa. Founded by Olympic champion Haile Gebrselassie, it attracts thousands of participants from Ethiopia and around the world, combining athletic competition with a festive atmosphere.",
      date: "2024-11-24",
      time: "8:00 AM - 1:00 PM",
      location: "Addis Ababa",
      coordinates: { lat: 9.0222, lng: 38.7468 }, // Addis Ababa coordinates
      category: "Festival",
      image: "/placeholder.svg?height=600&width=800&text=Great+Ethiopian+Run",
      organizer: "Great Ethiopian Run Organization",
      ticketPrice: "Registration: 500 ETB",
      website: "https://example.com/ethiopianrun",
    },
  ]

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter events based on search term, category, and date
  // const filteredEvents = events.filter((event) => {
  //   const matchesSearch =
  //     event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.location.toLowerCase().includes(searchTerm.toLowerCase())

  //   const matchesCategory = selectedCategory === "All" || event.category === selectedCategory

  //   const eventDate = new Date(event.date)
  //   const matchesDate = eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear

  //   return matchesSearch && matchesCategory && matchesDate
  // })

  // Get featured events
  const featuredEvents = events.filter((event) => event.featured)

  // Get upcoming events (next 3 months)
  const today = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(today.getMonth() + 3)

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= threeMonthsLater
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)

  // Handle subscription
  const handleSubscribe = () => {
    if (email && subscribedCategories.length > 0) {
      // In a real app, this would send the subscription to a backend
      alert(`Subscribed ${email} to notifications for: ${subscribedCategories.join(", ")}`)
      setShowSubscribeModal(false)
      setEmail("")
      setSubscribedCategories([])
    }
  }

  // Toggle category subscription
  const toggleCategory = (category: EventCategory) => {
    if (subscribedCategories.includes(category)) {
      setSubscribedCategories(subscribedCategories.filter((c) => c !== category))
    } else {
      setSubscribedCategories([...subscribedCategories, category])
    }
  }

  // Format date for display
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString)
  //   return date.toLocaleDateString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   })
  // }

  // Get month name
  // const getMonthName = (month: number) => {
  //   return new Date(2000, month, 1).toLocaleString("default", { month: "long" })
  // }

  // Generate calendar days
  // const getDaysInMonth = (year: number, month: number) => {
  //   return new Date(year, month + 1, 0).getDate()
  // }

  // const getFirstDayOfMonth = (year: number, month: number) => {
  //   return new Date(year, month, 1).getDay()
  // }

  // const generateCalendarDays = () => {
  //   const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
  //   const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
  //   const days = []

  //   // Add empty cells for days before the first day of the month
  //   // for (let i = 0; i < firstDay; i++) {
  //   //   days.push(null)
  //   // }

  //   // Add days of the month
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     days.push(i)
  //   }

  //   return days
  // }

  // Check if a day has events
  // const hasEvents = (day: number | null) => {
  //   if (day === null) return false

  //   const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  //   return events.some((event) => event.date === dateString)
  // }

  // Get events for a specific day
  // const getEventsForDay = (day: number | null) => {
  //   if (day === null) return []

  //   const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  //   return events.filter((event) => event.date === dateString)
  // }

  // Navigate to previous month
  // const goToPreviousMonth = () => {
  //   if (selectedMonth === 0) {
  //     setSelectedMonth(11)
  //     setSelectedYear(selectedYear - 1)
  //   } else {
  //     setSelectedMonth(selectedMonth - 1)
  //   }
  // }

  // Navigate to next month
  // const goToNextMonth = () => {
  //   if (selectedMonth === 11) {
  //     setSelectedMonth(0)
  //     setSelectedYear(selectedYear + 1)
  //   } else {
  //     setSelectedMonth(selectedMonth + 1)
  //   }
  // }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E91E63] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-8 px-4 md:px-6 lg:px-8">
        <div className="space-y-12">
          <HeroSection onOpenSubscribeModal={() => setShowSubscribeModal(true)} />

          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 z-10 border border-gray-100">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />

            <div className="flex justify-center mt-4 border-t pt-4">
              <div className="flex gap-3">
                <Button
                  variant={currentView === "list" ? "default" : "outline"}
                  onClick={() => setCurrentView("list")}
                  className={`flex items-center gap-2 ${
                    currentView === "list" ? "bg-[#E91E63] hover:bg-[#D81B60]" : ""
                  }`}
                  size="sm"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
                <Button
                  variant={currentView === "calendar" ? "default" : "outline"}
                  onClick={() => setCurrentView("calendar")}
                  className={`flex items-center gap-2 ${
                    currentView === "calendar" ? "bg-[#E91E63] hover:bg-[#D81B60]" : ""
                  }`}
                  size="sm"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar View
                </Button>
                <Button
                  variant={currentView === "map" ? "default" : "outline"}
                  onClick={() => setCurrentView("map")}
                  className={`flex items-center gap-2 ${
                    currentView === "map" ? "bg-[#E91E63] hover:bg-[#D81B60]" : ""
                  }`}
                  size="sm"
                >
                  <MapPin className="h-4 w-4" />
                  Map View
                </Button>
              </div>
            </div>
          </div>

          {/* Add Event CTA for logged-in users */}
          {isLoggedIn && <AddEventCTA />}

          {/* Featured Events */}
          {currentView === "list" && <FeaturedEvents events={featuredEvents} />}

          {/* Calendar View */}
          {currentView === "calendar" && (
            <CalendarView
              events={events}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          )}

          {/* Map View */}
          {currentView === "map" && <EventsMap events={events} />}

          {/* Upcoming Events */}
          {currentView === "list" && <UpcomingEvents events={upcomingEvents} />}

          {/* All Events (List View) */}
          {currentView === "list" && (
            <AllEvents
              events={events}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              resetFilters={resetFilters}
            />
          )}

          {/* Event Categories */}
          <EventCategories />

          {/* Plan Your Trip */}
          <PlanYourTrip />

          {/* Subscribe Modal */}
          <SubscribeModal
            isOpen={showSubscribeModal}
            onClose={() => setShowSubscribeModal(false)}
            email={email}
            setEmail={setEmail}
            subscribedCategories={subscribedCategories}
            toggleCategory={toggleCategory}
            handleSubscribe={handleSubscribe}
          />
        </div>
      </Container>
    </div>
  )
}
