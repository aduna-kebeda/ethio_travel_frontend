"use client"

import { useState } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  width,
  height,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  // Create a placeholder URL with dimensions if provided
  const placeholder =
    width && height ? `${fallbackSrc}?width=${width}&height=${height}&text=${encodeURIComponent(alt)}` : fallbackSrc

  return (
    <img
      src={imgSrc || placeholder}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setImgSrc(placeholder)}
    />
  )
}
