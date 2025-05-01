import Image from "next/image"
import { OtherInformationSidebar } from "./other-information-sidebar"

export function GalleryTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Mountain"
                  alt="Mountain landscape"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Sunset"
                  alt="Sunset view"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Coast"
                  alt="Coastal view"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Lalibela+Rock+Churches"
                  alt="Lalibela Rock Churches"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Church+Interior"
                    alt="Church Interior"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Ancient+Book"
                    alt="Ancient Book"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=600&text=People+Around+Campfire"
                  alt="People Around Campfire"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                page === 1 ? "bg-[#E91E63] text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-1">
        <OtherInformationSidebar />
      </div>
    </div>
  )
}
