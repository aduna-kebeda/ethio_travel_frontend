import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PackageCardProps {
  id: string
  title: string
  location: string
  region: string
  price: number
  duration: string
  image: string
  description?: string
}

export function PackageCard({ id, title, location, region, price, duration, image, description }: PackageCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs text-gray-500 mb-4">
          {location}, {region}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-[#E91E63] font-bold">${price}</span>
          <span className="text-xs text-gray-500">{duration}</span>
        </div>
        <Link href={`/packages/${id}`} className="block mt-4">
          <Button className="w-full rounded-full bg-[#E91E63] hover:bg-[#D81B60] transition-colors">View Details</Button>
        </Link>
      </div>
    </div>
  )
}
