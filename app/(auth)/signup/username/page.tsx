"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { AuthLayout } from "@/components/auth-layout"

export default function CreateUsernamePage() {
  const [username, setUsername] = useState("")
  const [isValid, setIsValid] = useState(false)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    // Simple validation - username must be at least 3 characters
    setIsValid(value.length >= 3)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      // Handle username creation
      console.log({ username })
      // Redirect to next step
    }
  }

  const handleSkip = () => {
    // Handle skip logic and redirect to next step
  }

  return (
    <AuthLayout imagePosition="left">
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <Logo />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create username</h2>
          <p className="mt-2 text-sm text-gray-600">Username can be changed anytime in the profile setting.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="relative">
              <Input
                id="username"
                placeholder="@ethiotraveler"
                value={username}
                onChange={handleUsernameChange}
                className="pr-10"
              />
              {isValid && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleSkip}>
              Skip
            </Button>
            <Button type="submit" className="w-full" disabled={!isValid}>
              Next
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
