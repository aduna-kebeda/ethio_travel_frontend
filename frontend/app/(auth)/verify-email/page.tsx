"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { verifyEmail } from "@/app/actions/auth-actions"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem("registrationEmail")
    if (!storedEmail) {
      router.push("/signup")
      return
    }
    setEmail(storedEmail)

    // Set up countdown timer
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await verifyEmail({ email, code })

      if (!result.success) {
        setError(result.error || "Invalid verification code")
        setIsLoading(false)
        return
      }

      // Redirect to the next step
      router.push("/signup/username")
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    // Implement resend code functionality
    setCountdown(60)
    setCanResend(false)
  }

  return (
    <AuthLayout>
      <div className="flex justify-center">
        <h2 className="text-2xl font-bold text-[#0D2B3E]">
          Ethio<span className="text-[#E91E63]">Travel</span>
        </h2>
      </div>
      <h2 className="mt-6 text-3xl font-bold tracking-tight text-center">Verify Your Email</h2>
      <p className="mt-2 text-sm text-muted-foreground text-center">We've sent a verification code to {email}</p>

      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

      <div className="mt-8">
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <div className="mt-1">
              <Input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
              />
            </div>
          </div>

          <div>
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
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                className="font-medium text-[#E91E63] hover:text-[#D81B60]"
              >
                Resend Code
              </button>
            ) : (
              <span className="text-sm">Resend in {countdown} seconds</span>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
