import type { Metadata } from "next"
import { getEvents, getEventsCalendar } from "../actions/event-actions"
import HeroSection from "./components/hero-section"
import EventFilters from "./components/event-filters"
import EventGrid from "./components/event-grid"
import CalendarView from "./components/calendar-view"

export const metadata: Metadata = {
  title: "Events | Travel Explorer",
  description: "Discover and join exciting events happening around you.",
}

interface SearchParams {
  search?: string
  category?: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { search, category } = searchParams
  const eventsData = await getEvents()
  const calendarData = await getEventsCalendar()

  const events = eventsData?.results || []

  // Define the Event type
  interface Event {
    title: string
    description: string
    location: string
    category?: string
    featured?: boolean
    [key: string]: any
  }

  // Filter events based on search params
  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch =
      !search ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = !category || event.category === category

    return matchesSearch && matchesCategory
  })

  // Find a featured event for the hero section
  const featuredEvent = events.find((event: Event) => event.featured)

  return (
    <main>
      <HeroSection featuredEvent={featuredEvent} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

        <EventFilters />

        <EventGrid events={filteredEvents} />

        <div className="mt-12">
          <CalendarView calendarData={calendarData} />
        </div>
      </div>
    </main>
  )
}
