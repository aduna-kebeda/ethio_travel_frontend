import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getEvent } from "@/app/actions/event-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, DollarSign, Share2 } from "lucide-react"
import RegisterButton from "./register-button"
import MapComponent from "../components/map-component"

interface EventPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  try {
    const event = await getEvent(params.id)

    if (!event) {
      return {
        title: "Event Not Found",
        description: "The requested event could not be found.",
      }
    }

    return {
      title: `${event.title} | Travel Explorer Events`,
      description: event.description.substring(0, 160),
    }
  } catch (error) {
    console.error("Error fetching event metadata:", error)
    return {
      title: "Event Details",
      description: "View details about this event",
    }
  }
}

export default async function EventPage({ params }: EventPageProps) {
  try {
    const event = await getEvent(params.id)

    if (!event) {
      notFound()
    }

    const {
      title,
      description,
      category,
      location,
      address,
      start_date,
      end_date,
      images,
      capacity,
      current_attendees,
      price,
      featured,
    } = event

    const eventDate = new Date(start_date)
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const startTime = new Date(start_date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const endTime = end_date
      ? new Date(end_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null

    const isFullyBooked = current_attendees >= capacity

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge className="text-sm px-3 py-1">{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
              <Image
                src={images || "/placeholder.svg?height=400&width=800"}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {featured && <Badge className="absolute top-4 right-4 bg-primary text-white">Featured</Badge>}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{description}</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <p className="mb-2">{address}</p>
                <MapComponent address={address} location={location} />
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Price</span>
                    </div>
                    <span className="text-xl font-bold">${Number(price).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Date</span>
                    </div>
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Time</span>
                    </div>
                    <span>
                      {startTime}
                      {endTime && ` - ${endTime}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Capacity</span>
                    </div>
                    <span>
                      {current_attendees}/{capacity}
                    </span>
                  </div>
                </div>

                <RegisterButton eventId={event.id} isFullyBooked={isFullyBooked} />

                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching event:", error)
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Error Loading Event</h2>
          <p className="text-muted-foreground mb-6">There was a problem loading this event. Please try again later.</p>
          <Button asChild>
            <a href="/events">Back to Events</a>
          </Button>
        </div>
      </div>
    )
  }
}
