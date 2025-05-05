"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"

export default function ChooseUsernamePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // In a real implementation, you would call an API to update the username
      // For now, we'll just simulate a delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to interests page
      router.push("/signup/interests")
    } catch (error) {
      console.error("Username update error:", error)
      setError("Failed to update username. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/signup/interests")
  }

  return (
    <AuthLayout imagePosition="left">
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <Logo />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Choose a username</h2>
          <p className="mt-2 text-sm text-gray-600">This will be your public identity on EthioTravel.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="e.g., traveler123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleSkip} disabled={isLoading}>
              Skip
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading || !username.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
