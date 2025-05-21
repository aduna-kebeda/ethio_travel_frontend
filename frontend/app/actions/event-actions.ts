"use server"

import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-driven-travel.onrender.com"

// Cache for events data
let eventsCache: {
  data: any
  timestamp: number
} | null = null

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

export async function getEvents() {
  try {
    // Check if we have valid cached data
    if (eventsCache && Date.now() - eventsCache.timestamp < CACHE_EXPIRATION) {
      console.log("Using cached events data")
      return eventsCache.data
    }

    console.log("Fetching fresh events data")
    const response = await fetch(`${API_URL}/api/events/events/`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Update cache
    eventsCache = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error("Error fetching events:", error)
    // Return empty results instead of throwing to prevent page crashes
    return { results: [] }
  }
}

export async function getEvent(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/events/events/${id}/`, {
      next: {
        revalidate: 60, // Revalidate every minute for individual events
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error)
    return null
  }
}

// Cache for upcoming events
let upcomingEventsCache: {
  data: any
  timestamp: number
} | null = null

export async function getUpcomingEvents() {
  try {
    // Check if we have valid cached data
    if (upcomingEventsCache && Date.now() - upcomingEventsCache.timestamp < CACHE_EXPIRATION) {
      return upcomingEventsCache.data
    }

    const response = await fetch(`${API_URL}/api/events/events/upcoming/`, {
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch upcoming events: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Update cache
    upcomingEventsCache = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }
}

// Cache for calendar data
let calendarCache: {
  data: any
  timestamp: number
} | null = null

export async function getEventsCalendar() {
  try {
    // Check if we have valid cached data
    if (calendarCache && Date.now() - calendarCache.timestamp < CACHE_EXPIRATION) {
      return calendarCache.data
    }

    const response = await fetch(`${API_URL}/api/events/events/calendar/`, {
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events calendar: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Update cache
    calendarCache = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error("Error fetching events calendar:", error)
    return {}
  }
}

export async function registerForEvent(eventId: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/api/events/registrations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ event: eventId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Failed to register for event: ${response.status} ${response.statusText}`)
    }

    // Clear cache to ensure fresh data on next fetch
    eventsCache = null
    upcomingEventsCache = null
    calendarCache = null

    // Revalidate the event page and events listing
    revalidatePath(`/events/${eventId}`)
    revalidatePath("/events")

    return await response.json()
  } catch (error) {
    console.error("Error registering for event:", error)
    throw error
  }
}