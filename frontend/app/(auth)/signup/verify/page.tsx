"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { verifyEmail } from "@/app/actions/auth-actions"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    // Get email from session storage
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("userEmail")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        // If no email is found, redirect to signup
        router.push("/signup")
      }
    }

    // Set up countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await verifyEmail({
        email,
        code: verificationCode,
      })

      if (!result.success) {
        setError(result.error || "Verification failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Redirect to username selection page
      router.push("/signup/username")
    } catch (error) {
      console.error("Verification error:", error)
      setError("Failed to verify email. Please try again.")
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    // In a real implementation, you would call an API to resend the code
    setCountdown(60)
    setCanResend(false)

    // Set up countdown again
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <Logo />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Verify your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            placeholder="Enter the 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full rounded-full bg-[#E91E63] hover:bg-[#D81B60]" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Didn't receive a code?{" "}
          {canResend ? (
            <button
              onClick={handleResendCode}
              className="font-medium text-[#E91E63] hover:text-[#D81B60]"
              disabled={isLoading}
            >
              Resend Code
            </button>
          ) : (
            <span className="text-gray-400">Resend code in {countdown}s</span>
          )}
        </p>
      </div>
    </AuthLayout>
  )
}
