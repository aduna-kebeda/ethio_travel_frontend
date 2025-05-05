import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date from ISO string to readable format
export function formatDate(dateString: string): string {
  if (!dateString) return "Unknown date"

  try {
    const date = new Date(dateString)
    // Use a more consistent date formatting approach
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}
