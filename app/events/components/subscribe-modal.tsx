"use client"

import type React from "react"

import { X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { EventCategory } from "../types"

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  setEmail: (email: string) => void
  subscribedCategories: EventCategory[]
  toggleCategory: (category: EventCategory) => void
  handleSubscribe: () => void
}

export const SubscribeModal = ({
  isOpen,
  onClose,
  email,
  setEmail,
  subscribedCategories,
  toggleCategory,
  handleSubscribe,
}: SubscribeModalProps) => {
  if (!isOpen) return null

  const categories: EventCategory[] = ["Festival", "Religious", "Cultural", "Music", "Food", "Historical"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubscribe()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#E91E63]/10 p-2 rounded-full">
            <Bell className="h-5 w-5 text-[#E91E63]" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Event Notifications</h3>
            <p className="text-gray-600 text-sm">Stay updated with upcoming events</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Event Categories</Label>
            <p className="text-sm text-gray-500 mb-2">Select the types of events you're interested in:</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={subscribedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm text-gray-700 cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#E91E63] hover:bg-[#D81B60] transition-colors"
              disabled={!email || subscribedCategories.length === 0}
            >
              Subscribe to Updates
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              You can unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
