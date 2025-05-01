import Image from "next/image"
import { Button } from "@/components/ui/button"

export function OtherInformationSidebar() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#E91E63] mb-6">Other Information</h3>

      <div className="mb-6">
        <h4 className="text-[#E91E63] font-medium mb-3">Weather</h4>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-md">
            <p className="text-gray-400 text-sm">Jan</p>
            <div className="h-1 bg-gray-200 w-full mt-1"></div>
          </div>
          <div className="bg-white p-3 rounded-md">
            <p className="text-gray-400 text-sm">Feb</p>
            <div className="h-1 bg-gray-200 w-full mt-1"></div>
          </div>
          <div className="bg-white p-3 rounded-md">
            <p className="text-gray-400 text-sm">Mar</p>
            <div className="h-1 bg-gray-200 w-full mt-1"></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-[#E91E63] font-medium mb-3">Safety Information</h4>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-md">
            <p className="text-gray-400 text-sm">Covid</p>
            <div className="h-1 bg-gray-200 w-full mt-1"></div>
          </div>
          <div className="bg-white p-3 rounded-md">
            <p className="text-gray-400 text-sm">Health</p>
            <div className="h-1 bg-gray-200 w-full mt-1"></div>
          </div>
          <div className="bg-white p-3 rounded-md">
            <p className="text-gray-400 text-sm">Travel</p>
            <div className="h-1 bg-gray-200 w-full mt-1"></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-[#E91E63] font-medium mb-3">What other people say</h4>
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <Image
              src="/placeholder.svg?height=40&width=40&text=User"
              alt="User"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              Ex quis velit et quia praesentium in nostrum labore nam rerum quis ut magni reprehent. Qui quidem neque
              non expedita sit dolo.
            </p>
          </div>
        </div>
      </div>

      <Button className="w-full bg-[#E91E63] hover:bg-[#D81B60] rounded-full">Check Availability</Button>
    </div>
  )
}
