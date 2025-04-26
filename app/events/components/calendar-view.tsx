"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Event } from "../types"

interface CalendarViewProps {
  events: Event[]
  selectedMonth: number
  selectedYear: number
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
}

export const CalendarView = ({
  events,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}: CalendarViewProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

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

  // Get month name
  const getMonthName = (month: number) => {
    return new Date(2000, month, 1).toLocaleString("default", { month: "long" })
  }

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Check if a day has events
  const hasEvents = (day: number | null) => {
    if (day === null) return false

    return events.some((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getFullYear() === selectedYear &&
        eventDate.getMonth() === selectedMonth &&
        eventDate.getDate() === day
      )
    })
  }

  // Get events for a specific day
  const getEventsForDay = (day: number | null) => {
    if (day === null) return []

    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getFullYear() === selectedYear &&
        eventDate.getMonth() === selectedMonth &&
        eventDate.getDate() === day
      )
    })
  }

  // Get event count for a specific day
  const getEventCount = (day: number | null) => {
    if (day === null) return 0
    return getEventsForDay(day).length
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
    setSelectedDay(null)
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
    setSelectedDay(null)
  }

  // Go to current month
  const goToCurrentMonth = () => {
    const now = new Date()
    setSelectedMonth(now.getMonth())
    setSelectedYear(now.getFullYear())
    setSelectedDay(now.getDate())
  }

  const calendarDays = generateCalendarDays()
  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []
  const today = new Date()
  const isCurrentMonth = today.getMonth() === selectedMonth && today.getFullYear() === selectedYear
  const currentDay = today.getDate()

  return (
    <section className="py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-[#E91E63]/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-[#E91E63] mr-3" />
            <h2 className="text-2xl font-bold">Event Calendar</h2>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={goToPreviousMonth} variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="text-lg font-medium min-w-[180px] text-center">
              {getMonthName(selectedMonth)} {selectedYear}
            </div>

            <Button onClick={goToNextMonth} variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button onClick={goToCurrentMonth} variant="outline" size="sm" className="ml-2">
              Today
            </Button>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-700 border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`bg-white min-h-[110px] p-3 ${
                day === selectedDay ? "ring-2 ring-[#E91E63]" : ""
              } ${day === null ? "bg-gray-50" : "cursor-pointer hover:bg-gray-50"} ${
                isCurrentMonth && day === currentDay ? "bg-pink-50" : ""
              }`}
              onClick={() => day !== null && setSelectedDay(day)}
            >
              {day !== null && (
                <>
                  <div
                    className={`flex justify-center items-center h-8 w-8 rounded-full mb-2 mx-auto ${
                      isCurrentMonth && day === currentDay
                        ? "bg-[#E91E63] text-white"
                        : hasEvents(day)
                          ? "bg-[#E91E63]/10 text-[#E91E63] font-medium"
                          : "text-gray-700"
                    }`}
                  >
                    {day}
                  </div>
                  {hasEvents(day) && (
                    <div className="space-y-1.5">
                      {getEventsForDay(day)
                        .slice(0, 2)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1.5 bg-pink-50 rounded truncate text-[#E91E63] border-l-2 border-[#E91E63]"
                          >
                            {event.title}
                          </div>
                        ))}
                      {getEventCount(day) > 2 && (
                        <div className="text-xs text-gray-500 text-center">+{getEventCount(day) - 2} more</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Events */}
      {selectedDay && (
        <div className="mt-8 animate-fadeIn">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-[#E91E63]" />
            Events on {getMonthName(selectedMonth)} {selectedDay}, {selectedYear}
          </h3>

          {selectedDayEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDayEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-l-4 border-[#E91E63]">
                  <CardContent className="p-0">
                    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-[#E91E63] mr-2">{event.category}</Badge>
                          {event.ticketPrice === "Free" ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Free Event
                            </Badge>
                          ) : (
                            <Badge variant="outline">{event.ticketPrice}</Badge>
                          )}
                        </div>

                        <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                        <p className="text-gray-600 text-sm mb-4">{event.shortDescription}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-gray-700">
                            <Clock className="h-4 w-4 mr-2 text-[#E91E63]" />
                            {event.time}
                          </div>

                          <div className="flex items-center text-gray-700">
                            <MapPin className="h-4 w-4 mr-2 text-[#E91E63]" />
                            {event.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center md:items-end gap-2">
                        <Link href={`/events/${event.id}`}>
                          <Button className="w-full md:w-auto bg-[#E91E63] hover:bg-[#D81B60]">View Details</Button>
                        </Link>

                        {event.website && (
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto"
                          >
                            <Button variant="outline" className="w-full flex items-center gap-1">
                              Website
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">No events scheduled for this day.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
