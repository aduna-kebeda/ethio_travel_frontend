"use server"

import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-driven-travel.onrender.com"

export async function getEvents() {
  try {
    const response = await fetch(`${API_URL}/api/events/events/`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching events:", error)
    return { results: [] }
  }
}

export async function getEvent(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/events/events/${id}/`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch event")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

export async function getUpcomingEvents() {
  try {
    const response = await fetch(`${API_URL}/api/events/events/upcoming/`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch upcoming events")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }
}

export async function getEventsCalendar() {
  try {
    const response = await fetch(`${API_URL}/api/events/events/calendar/`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch events calendar")
    }

    return await response.json()
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
      throw new Error(errorData.detail || "Failed to register for event")
    }

    revalidatePath(`/events/${eventId}`)
    return await response.json()
  } catch (error) {
    console.error("Error registering for event:", error)
    throw error
  }
}
