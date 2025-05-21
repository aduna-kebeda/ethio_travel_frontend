"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { verifyEmail } from "@/app/actions/auth-actions"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isEmailDisabled, setIsEmailDisabled] = useState(false)

  useEffect(() => {
    // Only access sessionStorage in browser environment
    if (typeof window !== "undefined") {
      // Get email from session storage
      const storedEmail = sessionStorage.getItem("registrationEmail")
      if (storedEmail) {
        setEmail(storedEmail)
        setIsEmailDisabled(true)
      }
    }

    // Countdown for resend button
    let timer: NodeJS.Timeout
    if (!canResend && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, canResend])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !code) {
      setError("Email and verification code are required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await verifyEmail({ email, code })

      if (!result.success) {
        setError(result.error || "Verification failed. Please check your code and try again.")
        setIsLoading(false)
        return
      }

      setSuccess(true)

      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    // Implement resend code functionality here
    setCountdown(60)
    setCanResend(false)
    // You would typically call an API endpoint to resend the code
    alert("A new verification code has been sent to your email.")
  }

  return (
    <AuthLayout>
      <div className="flex justify-center">
        <Link href="/" className="text-2xl font-bold text-[#0D2B3E]">
          Ethio<span className="text-[#E91E63]">Travel</span>
        </Link>
      </div>
      <h2 className="mt-6 text-3xl font-bold tracking-tight text-center">Verify Your Email</h2>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        We've sent a verification code to your email. Please enter it below.
      </p>

      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      {success && (
        <div className="mt-4 rounded-md bg-green-50 p-4 border border-green-200 text-sm text-green-600">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>Email verified successfully! Redirecting to login page...</div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              disabled={isEmailDisabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code from your email"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-[#E91E63] hover:bg-[#D81B60]"
            disabled={isLoading || success}
          >
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

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            {canResend ? (
              <button onClick={handleResendCode} className="font-medium text-[#E91E63] hover:text-[#D81B60]">
                Resend Code
              </button>
            ) : (
              <span className="text-gray-500">Resend in {countdown} seconds</span>
            )}
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link href="/login" className="font-medium text-[#E91E63] hover:text-[#D81B60]">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
