"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, CalendarRange, Mail } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export const PlanYourTrip = () => {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "1",
    interests: "",
    email: "",
    includeEvents: true,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, includeEvents: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to a backend
    console.log("Form submitted:", formData)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        travelers: "1",
        interests: "",
        email: "",
        includeEvents: true,
      })
    }, 3000)
  }

  return (
    <section className="py-12 bg-gradient-to-br from-[#E91E63]/5 to-[#E91E63]/10 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Plan Your Trip Around Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let us help you create a custom itinerary that includes your favorite events and destinations in Ethiopia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="md:col-span-2 shadow-lg border-0">
            <CardHeader className="bg-[#E91E63]/5 border-b">
              <CardTitle>Custom Trip Request</CardTitle>
              <CardDescription>Tell us about your dream Ethiopian adventure</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600">
                    We've received your trip planning request. Our travel experts will contact you shortly with a
                    customized itinerary.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Preferred Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          placeholder="Where do you want to go?"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="travelers">Number of Travelers</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Select
                          value={formData.travelers}
                          onValueChange={(value) => handleSelectChange("travelers", value)}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select number of travelers" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "traveler" : "travelers"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Events & Activities You're Interested In</Label>
                    <Textarea
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="Tell us about the events or activities you'd like to experience..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Where should we send your custom itinerary?"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeEvents"
                      checked={formData.includeEvents}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="includeEvents" className="text-sm text-gray-600">
                      Include cultural events and festivals in my itinerary
                    </Label>
                  </div>

                  <div className="text-center">
                    <Button type="submit" className="bg-[#E91E63] hover:bg-[#D81B60] transition-colors px-8 py-2">
                      Plan My Trip
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-[#E91E63]/5 border-b">
                <CardTitle className="flex items-center">
                  <CalendarRange className="h-5 w-5 mr-2" />
                  Why Plan Around Events?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-[#E91E63]/10 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="h-4 w-4 text-[#E91E63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-sm">Experience authentic cultural celebrations</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#E91E63]/10 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="h-4 w-4 text-[#E91E63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-sm">Meet locals during festive occasions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#E91E63]/10 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="h-4 w-4 text-[#E91E63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-sm">Capture unique photos and memories</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#E91E63]/10 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="h-4 w-4 text-[#E91E63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-sm">Gain deeper understanding of Ethiopian traditions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#E91E63]/10 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        className="h-4 w-4 text-[#E91E63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-sm">Enjoy special seasonal activities and foods</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#E91E63]/10 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-[#E91E63]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Quick Response</h3>
                    <p className="text-sm text-gray-500">We'll get back to you within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
