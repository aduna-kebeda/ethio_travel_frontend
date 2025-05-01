export type EventCategory = "Festival" | "Religious" | "Cultural" | "Music" | "Food" | "Historical" | "All"

export interface Coordinates {
  lat: number
  lng: number
}

export interface Event {
  id: string
  title: string
  description: string
  shortDescription: string
  date: string
  endDate?: string
  time: string
  location: string
  coordinates?: Coordinates
  category: EventCategory
  image: string
  historicalSignificance?: string
  featured?: boolean
  organizer?: string
  ticketPrice?: string
  website?: string
}
