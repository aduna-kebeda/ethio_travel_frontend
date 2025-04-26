"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string>("")

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    setError(errorParam)

    // Set a user-friendly error description based on the error code
    switch (errorParam) {
      case "Configuration":
        setErrorDescription("There is a problem with the server configuration.")
        break
      case "AccessDenied":
        setErrorDescription("You do not have permission to sign in.")
        break
      case "Verification":
        setErrorDescription("The verification link may have been used or is no longer valid.")
        break
      case "OAuthSignin":
        setErrorDescription("Error in the OAuth sign-in process.")
        break
      case "OAuthCallback":
        setErrorDescription("Error in the OAuth callback process.")
        break
      case "OAuthCreateAccount":
        setErrorDescription("Could not create OAuth provider user in the database.")
        break
      case "EmailCreateAccount":
        setErrorDescription("Could not create email provider user in the database.")
        break
      case "Callback":
        setErrorDescription("Error in the OAuth callback handler.")
        break
      case "OAuthAccountNotLinked":
        setErrorDescription("Email on the account is already linked, but not with this OAuth account.")
        break
      case "EmailSignin":
        setErrorDescription("Check your email inbox for the sign-in link.")
        break
      case "CredentialsSignin":
        setErrorDescription("The credentials you provided were invalid.")
        break
      case "SessionRequired":
        setErrorDescription("You must be signed in to access this page.")
        break
      case "Default":
      default:
        setErrorDescription("An unexpected error occurred. Please try again later.")
        break
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">Authentication Error</h1>

        {error ? (
          <>
            <p className="mb-2 text-lg font-semibold">{error}</p>
            <p className="mb-6 text-gray-600 dark:text-gray-300">{errorDescription}</p>
          </>
        ) : (
          <p className="mb-6 text-gray-600 dark:text-gray-300">An unknown error occurred during authentication.</p>
        )}

        <div className="flex flex-col space-y-3">
          <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
            Return to Login
          </Link>
          <Link
            href="/"
            className="rounded border border-gray-300 px-4 py-2 text-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
