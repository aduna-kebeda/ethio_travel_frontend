"use client"

import { CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export const AddEventCTA = () => {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-r from-[#E91E63]/10 to-[#E91E63]/5 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold mb-2">Organizing an Event in Ethiopia?</h3>
          <p className="text-gray-600 mb-0 md:mb-2">
            Share your event with thousands of travelers and locals. Add your cultural celebration, festival, or
            gathering to our platform.
          </p>
        </div>
        <Button
          onClick={() => router.push("/events/create")}
          className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-6 py-3 rounded-full flex items-center whitespace-nowrap"
        >
          <CalendarPlus className="mr-2 h-5 w-5" />
          Add Your Event
        </Button>
      </div>
    </div>
  )
}
