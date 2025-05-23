"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import('@/components/map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div className="w-full h-full bg-gray-100 animate-pulse" />
    </div>
  ),
})

interface MapComponentProps {
  address: string
  location: string
}

export default function MapComponent({ address, location }: MapComponentProps) {
  return <Map address={address} location={location} />
} 