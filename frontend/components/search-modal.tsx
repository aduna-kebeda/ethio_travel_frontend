"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  initialDestination?: string
  initialTravelType?: string
  initialDuration?: string
}

export const SearchModal = ({
  isOpen,
  onClose,
  initialDestination = "",
  initialTravelType = "Any",
  initialDuration = "Any",
}: SearchModalProps) => {
  const router = useRouter()
  const [destination, setDestination] = useState(initialDestination)
  const [travelType, setTravelType] = useState(initialTravelType)
  const [duration, setDuration] = useState(initialDuration)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [budget, setBudget] = useState<string>("Any")
  const [travelers, setTravelers] = useState<number>(2)

  const [activities, setActivities] = useState({
    hiking: false,
    cultural: false,
    wildlife: false,
    historical: false,
    culinary: false,
    photography: false,
  })

  useEffect(() => {
    if (isOpen) {
      setDestination(initialDestination)
      setTravelType(initialTravelType)
      setDuration(initialDuration)
    }
  }, [isOpen, initialDestination, initialTravelType, initialDuration])

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams()

    if (destination) params.append("search", destination)
    if (travelType !== "Any") params.append("type", travelType)
    if (duration !== "Any") params.append("duration", duration)
    if (budget !== "Any") params.append("budget", budget)
    if (travelers > 0) params.append("travelers", travelers.toString())
    if (date) params.append("date", format(date, "yyyy-MM-dd"))

    // Add selected activities
    const selectedActivities = Object.entries(activities)
      .filter(([_, isSelected]) => isSelected)
      .map(([activity]) => activity)

    if (selectedActivities.length > 0) {
      params.append("activities", selectedActivities.join(","))
    }

    // Navigate to search results
    router.push(`/packages?${params.toString()}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Find Your Perfect Trip</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Where do you want to go?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="travel-type">Travel Type</Label>
              <select
                id="travel-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
              >
                <option value="Any">Any Type</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Family">Family</option>
                <option value="Honeymoon">Honeymoon</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="Any">Any Duration</option>
                <option value="1-3 days">1-3 days</option>
                <option value="4-7 days">4-7 days</option>
                <option value="8-14 days">8-14 days</option>
                <option value="15+ days">15+ days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <select
                id="budget"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="Any">Any Budget</option>
                <option value="Budget">Budget (Under $500)</option>
                <option value="Mid-range">Mid-range ($500-$1000)</option>
                <option value="Luxury">Luxury ($1000-$2000)</option>
                <option value="Ultra-Luxury">Ultra-Luxury ($2000+)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="travelers">Number of Travelers</Label>
            <div className="flex items-center">
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

          <div className="grid gap-2">
            <Label>Activities</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(activities).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => setActivities({ ...activities, [key]: checked === true })}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSearch} className="bg-[#E91E63] hover:bg-[#D81B60]">
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
