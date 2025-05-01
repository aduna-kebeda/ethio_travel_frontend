"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Upload, Info, Loader2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/upload-file"
import type { EventCategory } from "../types"

export default function CreateEventPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const [eventData, setEventData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "Cultural" as EventCategory,
    date: "",
    endDate: "",
    time: "",
    location: "",
    organizer: "",
    ticketPrice: "",
    website: "",
    historicalSignificance: "",
    image: "",
    featured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setEventData((prev) => ({ ...prev, featured: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload image if selected
      if (imageFile) {
        setIsUploading(true)
        const imageUrl = await uploadFile(imageFile, "events", (progress) => {
          setUploadProgress(progress)
        })
        setEventData((prev) => ({ ...prev, image: imageUrl }))
        setIsUploading(false)
      }

      // In a real app, this would send the data to a backend
      console.log("Event submitted:", { ...eventData, image: imageFile ? eventData.image : "" })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitting(false)
      setIsSuccess(true)

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      })

      // Redirect after success
      setTimeout(() => {
        router.push("/events")
      }, 2000)
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Submission failed",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Redirect if not logged in
  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/events/create")
    return null
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E63]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Add Your Event</h1>
            <p className="text-gray-600">
              Share your cultural event, festival, or gathering with the EthioTravel community
            </p>
          </div>

          {isSuccess ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center">
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
                <h3 className="text-xl font-bold mb-2">Event Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for sharing your event. Our team will review it shortly and publish it to our platform.
                </p>
                <div className="animate-pulse">Redirecting to events page...</div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-[#E91E63]/5 border-b">
                <CardTitle>Event Information</CardTitle>
                <CardDescription>Please provide details about your event</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full rounded-none">
                    <TabsTrigger value="details">Basic Details</TabsTrigger>
                    <TabsTrigger value="location">Location & Time</TabsTrigger>
                    <TabsTrigger value="additional">Additional Info</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit}>
                    <div className="p-6">
                      <TabsContent value="details" className="mt-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Event Title*</Label>
                            <Input
                              id="title"
                              name="title"
                              value={eventData.title}
                              onChange={handleChange}
                              placeholder="Enter the name of your event"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shortDescription">Short Description* (max 150 characters)</Label>
                            <Input
                              id="shortDescription"
                              name="shortDescription"
                              value={eventData.shortDescription}
                              onChange={handleChange}
                              placeholder="A brief description for listings"
                              maxLength={150}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Full Description*</Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={eventData.description}
                              onChange={handleChange}
                              placeholder="Provide a detailed description of your event"
                              rows={5}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category">Event Category*</Label>
                            <Select
                              value={eventData.category}
                              onValueChange={(value) => handleSelectChange("category", value)}
                              required
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Festival">Festival</SelectItem>
                                <SelectItem value="Religious">Religious</SelectItem>
                                <SelectItem value="Cultural">Cultural</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Historical">Historical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="image">Event Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center relative">
                              {imagePreview ? (
                                <div className="relative">
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Event preview"
                                    className="h-40 mx-auto object-contain rounded-md"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                    onClick={() => {
                                      setImagePreview(null)
                                      setImageFile(null)
                                    }}
                                    disabled={isUploading || isSubmitting}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-500 mb-2">
                                    Drag and drop an image, or click to browse
                                  </p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById("event-image")?.click()}
                                    disabled={isUploading || isSubmitting}
                                  >
                                    Select Image
                                  </Button>
                                </>
                              )}

                              {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                  <div className="text-white text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                    <p className="text-sm">{Math.round(uploadProgress)}%</p>
                                  </div>
                                </div>
                              )}

                              <Input
                                id="event-image"
                                name="image"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isUploading || isSubmitting}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => setActiveTab("location")}
                            className="bg-[#E91E63] hover:bg-[#D81B60]"
                            disabled={isUploading || isSubmitting}
                          >
                            Next: Location & Time
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="location" className="mt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date">Start Date*</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  id="date"
                                  name="date"
                                  type="date"
                                  value={eventData.date}
                                  onChange={handleChange}
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="endDate">End Date (if multi-day event)</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  id="endDate"
                                  name="endDate"
                                  type="date"
                                  value={eventData.endDate}
                                  onChange={handleChange}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="time">Event Time*</Label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="time"
                                name="time"
                                value={eventData.time}
                                onChange={handleChange}
                                placeholder="e.g. 10:00 AM - 4:00 PM or All day"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location">Event Location*</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="location"
                                name="location"
                                value={eventData.location}
                                onChange={handleChange}
                                placeholder="e.g. Meskel Square, Addis Ababa"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700">
                              Providing accurate location information helps travelers plan their trip to attend your
                              event.
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("details")}
                            disabled={isUploading || isSubmitting}
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setActiveTab("additional")}
                            className="bg-[#E91E63] hover:bg-[#D81B60]"
                            disabled={isUploading || isSubmitting}
                          >
                            Next: Additional Info
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="additional" className="mt-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="organizer">Event Organizer</Label>
                            <Input
                              id="organizer"
                              name="organizer"
                              value={eventData.organizer}
                              onChange={handleChange}
                              placeholder="Name of organization or person organizing the event"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ticketPrice">Ticket Price</Label>
                            <Input
                              id="ticketPrice"
                              name="ticketPrice"
                              value={eventData.ticketPrice}
                              onChange={handleChange}
                              placeholder="e.g. Free, 200 ETB, or 100-500 ETB"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="website">Event Website or Social Media</Label>
                            <Input
                              id="website"
                              name="website"
                              type="url"
                              value={eventData.website}
                              onChange={handleChange}
                              placeholder="https://example.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="historicalSignificance">Historical or Cultural Significance</Label>
                            <Textarea
                              id="historicalSignificance"
                              name="historicalSignificance"
                              value={eventData.historicalSignificance}
                              onChange={handleChange}
                              placeholder="Explain any historical or cultural significance of this event"
                              rows={3}
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                              id="featured"
                              checked={eventData.featured}
                              onCheckedChange={handleCheckboxChange}
                              disabled={isSubmitting}
                            />
                            <Label htmlFor="featured" className="text-sm text-gray-600">
                              Request featured placement (subject to approval)
                            </Label>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("location")}
                            disabled={isUploading || isSubmitting}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="bg-[#E91E63] hover:bg-[#D81B60]"
                            disabled={isUploading || isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Event"
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </div>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  )
}
