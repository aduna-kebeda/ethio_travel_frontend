"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: "instant", // Use "smooth" for smooth scrolling, "instant" for immediate jump
    })
  }, [pathname, searchParams])

  return null
}
