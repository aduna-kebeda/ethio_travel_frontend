"use client"

import type React from "react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface CalendarEvent {
  id: number
  title: string
  category: string
}

interface CalendarData {
  [date: string]: CalendarEvent[]
}

interface CalendarViewProps {
  calendarData: CalendarData
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Convert date strings to Date objects for the calendar
  const eventDates = Object.keys(calendarData).map((dateStr) => new Date(dateStr))

  // Get events for the selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return []

    const dateStr = date.toISOString().split("T")[0]
    return calendarData[dateStr] || []
  }

  const selectedEvents = getEventsForDate(selectedDate)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Events Calendar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasEvent: (date) => {
                const dateStr = date.toISOString().split("T")[0]
                return !!calendarData[dateStr]
              },
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: "rgba(var(--primary), 0.1)",
                fontWeight: "bold",
                borderRadius: "0.25rem",
              },
            }}
          />
        </div>
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">
                Events on{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-muted-foreground">No events on this date</p>
              ) : (
                <ul className="space-y-3">
                  {selectedEvents.map((event) => (
                    <li key={event.id} className="border-b pb-3 last:border-0">
                      <Link href={`/events/${event.id}`} className="flex items-center justify-between group">
                        <span className="font-medium group-hover:text-primary transition-colors">{event.title}</span>
                        <Badge variant="outline">{event.category}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
