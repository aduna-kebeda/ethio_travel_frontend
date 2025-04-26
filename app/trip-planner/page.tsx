"use client"

import type React from "react"

import { useState } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function TripPlannerPage() {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState("")
  const [preferences, setPreferences] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [interests, setInterests] = useState({
    cultural: false,
    adventure: false,
    nature: false,
    historical: false,
    culinary: false,
    relaxation: false,
    photography: false,
    shopping: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to a generated itinerary page
      router.push("/packages?ai=true")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#0D2B3E] mb-4">Create Your Perfect Ethiopian Trip</h1>
            <p className="text-gray-600">
              Tell us about your dream trip to Ethiopia, and our AI will create a personalized itinerary just for you.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="destination">Where in Ethiopia would you like to visit?</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Addis Ababa, Lalibela, Danakil Depression"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date < new Date() || (startDate && date < startDate)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <div className="flex items-center mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </Button>
                    <span className="mx-4 min-w-[2rem] text-center">{travelers}</span>
                    <Button type="button" variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range (USD)</Label>
                  <select
                    id="budget"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  >
                    <option value="">Select your budget</option>
                    <option value="budget">Budget (Under $1000)</option>
                    <option value="moderate">Moderate ($1000-$3000)</option>
                    <option value="luxury">Luxury ($3000-$5000)</option>
                    <option value="ultra">Ultra Luxury ($5000+)</option>
                  </select>
                </div>

                <div>
                  <Label>What are you interested in?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                    {Object.entries(interests).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setInterests({ ...interests, [key]: checked === true })}
                        />
                        <label
                          htmlFor={key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {key}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferences">Any specific preferences or requirements?</Label>
                  <Textarea
                    id="preferences"
                    placeholder="Tell us about any dietary restrictions, accessibility needs, or specific experiences you're looking for..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating your itinerary...
                    </>
                  ) : (
                    "Create My Trip Plan"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#0D2B3E] mb-4">Why Use Our AI Trip Planner?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#E91E63]/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#E91E63]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Personalized Itineraries</h3>
                <p className="text-sm text-gray-600">
                  Get a custom travel plan based on your preferences, not generic suggestions.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#E91E63]/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#E91E63]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Save Time Planning</h3>
                <p className="text-sm text-gray-600">
                  Create a detailed day-by-day itinerary in seconds instead of hours of research.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#E91E63]/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#E91E63]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Local Expertise</h3>
                <p className="text-sm text-gray-600">
                  Our AI is trained on Ethiopian travel data to recommend authentic experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
