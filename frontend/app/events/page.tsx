import type { Metadata } from "next"
import { getEvents, getEventsCalendar } from "../actions/event-actions"
import HeroSection from "./components/hero-section"
import EventFilters from "./components/event-filters"
import EventGrid from "./components/event-grid"
import CalendarView from "./components/calendar-view"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Events | Travel Explorer",
  description: "Discover and join exciting events happening around you.",
}

interface SearchParams {
  search?: string
  category?: string
  location?: string
  date?: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { search, category, location, date } = searchParams

  // Fetch data with a timeout to prevent hanging
  const eventsDataPromise = Promise.race([
    getEvents(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching events")), 10000)),
  ]) as Promise<any>

  const calendarDataPromise = Promise.race([
    getEventsCalendar(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching calendar")), 10000)),
  ]) as Promise<any>

  // Fetch data in parallel
  const [eventsData, calendarData] = await Promise.all([
    eventsDataPromise.catch((err) => {
      console.error("Error fetching events:", err)
      return { results: [] }
    }),
    calendarDataPromise.catch((err) => {
      console.error("Error fetching calendar:", err)
      return {}
    }),
  ])

  const events = eventsData?.results || []

  // Define the Event type
  interface Event {
    id: number
    title: string
    description: string
    location: string
    category?: string
    featured?: boolean
    start_date?: string
    [key: string]: any
  }

  // Filter events based on search params - case insensitive
  const filteredEvents = events.filter((event: Event) => {
    // Search filter - check multiple fields case insensitive
    const matchesSearch =
      !search ||
      [event.title, event.description, event.location, event.category].some(
        (field) => field && field.toLowerCase().includes(search.toLowerCase()),
      )

    // Category filter
    const matchesCategory = !category || (event.category && event.category.toLowerCase() === category.toLowerCase())

    // Location filter
    const matchesLocation =
      !location || (event.location && event.location.toLowerCase().includes(location.toLowerCase()))

    // Date filter
    const matchesDate = !date || (event.start_date && event.start_date.split("T")[0] === date)

    return matchesSearch && matchesCategory && matchesLocation && matchesDate
  })

  // Find a featured event for the hero section
  const featuredEvent = events.find((event: Event) => event.featured) || (events.length > 0 ? events[0] : null)

  return (
    <main>
      <Suspense fallback={<div className="h-[400px] bg-gray-100 animate-pulse" />}>
        <HeroSection featuredEvent={featuredEvent} />
      </Suspense>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

        <EventFilters />

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-[350px]">
                  <Skeleton className="h-[180px] w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ))}
            </div>
          }
        >
          <div className="mb-4">
            <p className="text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
              {search || category || location || date ? " matching your filters" : ""}
            </p>
          </div>
          <EventGrid events={filteredEvents} />
        </Suspense>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Event Calendar</h2>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CalendarView calendarData={calendarData} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
