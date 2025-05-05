"use client"

export function useSearchParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams() // Return an empty URLSearchParams object on the server
  }

  return new URLSearchParams(window.location.search) // Use window.location.search on the client
}
