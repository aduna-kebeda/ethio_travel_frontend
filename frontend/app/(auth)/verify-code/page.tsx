"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"

export default function VerifyCodePage() {
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle code verification
    console.log({ code })
  }

  const handleResendCode = () => {
    // Handle resend code logic
    console.log("Resend code")
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <Link href="/forgot-password" className="flex items-center text-sm text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Link>
        <Logo />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Verify code</h2>
        <p className="mt-2 text-sm text-gray-600">An authentication code has been sent to your email.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            6-Digit Code
          </label>
          <div className="relative">
            <Input
              id="code"
              type={showCode ? "text" : "password"}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="text-sm">
          <button type="button" onClick={handleResendCode} className="font-medium text-primary hover:text-primary/90">
            Didn't receive a code? Resend
          </button>
        </div>

        <Button type="submit" className="w-full">
          Verify
        </Button>
      </form>
    </AuthLayout>
  )
}
