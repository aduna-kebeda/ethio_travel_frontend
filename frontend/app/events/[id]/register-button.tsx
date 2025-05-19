"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface RegisterButtonProps {
  eventId: string
  isFullyBooked: boolean
}

export default function RegisterButton({ eventId, isFullyBooked }: RegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      // Here you would implement the actual registration logic
      // For example: await registerForEvent(eventId)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error registering for event:", error)
      toast({
        title: "Registration failed",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleRegister} disabled={isLoading || isFullyBooked} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isFullyBooked ? (
        "Fully Booked"
      ) : (
        "Register Now"
      )}
    </Button>
  )
}
