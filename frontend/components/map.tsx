'use client'

interface MapComponentProps {
  location: string
}

export const MapComponent = ({ location }: MapComponentProps) => {
  return (
    <div className="w-full h-full">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(location)}`}
        className="rounded-lg"
        title="Location Map"
      />
    </div>
  )
} 