import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Users, Clock } from "lucide-react"

export function TripPlanner() {
  return (
    <section className="bg-white rounded-xl shadow-md overflow-hidden my-12">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 lg:p-10">
          <h2 className="text-3xl font-bold mb-6">Plan Your Perfect Ethiopian Adventure</h2>
          <p className="text-gray-600 mb-8">
            Let us help you create a personalized itinerary based on your interests, budget, and travel dates. Our
            AI-powered trip planner will suggest the perfect combination of destinations and activities.
          </p>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ethiopia</SelectItem>
                      <SelectItem value="north">Northern Circuit</SelectItem>
                      <SelectItem value="south">Southern Circuit</SelectItem>
                      <SelectItem value="east">Eastern Ethiopia</SelectItem>
                      <SelectItem value="west">Western Ethiopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="date" className="pl-10" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Number of travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3-5">3-5 People</SelectItem>
                      <SelectItem value="6+">6+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Trip duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekend">Weekend (1-3 days)</SelectItem>
                      <SelectItem value="short">Short Trip (4-7 days)</SelectItem>
                      <SelectItem value="medium">Medium Trip (8-14 days)</SelectItem>
                      <SelectItem value="long">Long Trip (15+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  Historical Sites
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Nature & Wildlife
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Cultural Experiences
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Adventure
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Food & Cuisine
                </Button>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">Generate My Itinerary</Button>
          </div>
        </div>

        <div className="relative h-full min-h-[400px] lg:min-h-0">
          <img
            src="/assets/resort.jpg"
            alt="Trip Planning"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 right-6 max-w-[200px] rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/beach.jpg" alt="AI Trip Planner" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
