// app/actions/auth-actions.ts
"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface RegisterUserData {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
  role: string
}

interface VerifyEmailData {
  email: string
  code: string
}

interface LoginData {
  email: string
  password: string
}

interface LogoutData {
  refresh: string
}

interface User {
  id?: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  status?: string
  email_verified?: boolean
  [key: string]: unknown
}

interface GoogleLoginData {
  email: string
  username: string
  first_name: string
  last_name: string
  role: string
}

// API response interfaces
interface ApiSuccessResponse {
  status: string
  message: string
  data: {
    user: User
    access_token: string
    refresh_token: string
  }
}

// Field-specific errors format from the API
interface FieldErrors {
  [field: string]: string[]
}

const API_BASE_URL = "https://ai-driven-travel.onrender.com/api"

const setAuthCookies = async (accessToken: string, refreshToken: string, user?: User) => {
  const cookieStore = await cookies()

  cookieStore.set("access_token", accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  })

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  })

  cookieStore.set("token", accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  })

  if (user) {
    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    })
  }
}

const clearAuthCookies = async () => {
  const cookieStore = await cookies()
  cookieStore.set("access_token", "", { maxAge: -1, path: "/" })
  cookieStore.set("refresh_token", "", { maxAge: -1, path: "/" })
  cookieStore.set("user", "", { maxAge: -1, path: "/" })
  cookieStore.set("token", "", { maxAge: -1, path: "/" })
}

export async function registerUser(data: RegisterUserData) {
  try {
    console.log("Sending registration request to API...")

    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const responseText = await response.text()
    console.log("API Response status:", response.status)
    console.log("API Response text:", responseText)

    // Parse the JSON response
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse API response as JSON:", e)
      return {
        success: false,
        error: "Invalid response from server",
        data: null,
        fieldErrors: null,
      }
    }

    // Handle successful registration (status 201)
    if (response.status === 201) {
      console.log("Registration successful")

      if (result.status === "success" && result.data) {
        // IMPORTANT: Do NOT set auth cookies after registration
        // The user needs to verify their email first

        // Just return the success response with user data
        return {
          success: true,
          message: result.message || "Registration successful. Please check your email for verification code.",
          data: result.data,
          fieldErrors: null,
        }
      }
    }

    // Handle validation errors (status 400)
    if (response.status === 400) {
      console.log("Registration failed with validation errors:", result)

      // Check if the response is in the field-specific error format
      if (typeof result === "object" && !Array.isArray(result)) {
        const fieldErrors: Record<string, string> = {}

        // Process field-specific errors
        Object.entries(result).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            fieldErrors[field] = errors.join(", ")
          } else if (typeof errors === "string") {
            fieldErrors[field] = errors
          }
        })

        if (Object.keys(fieldErrors).length > 0) {
          return {
            success: false,
            error: "Validation failed",
            data: null,
            fieldErrors,
          }
        }
      }

      // Fallback for other error formats
      return {
        success: false,
        error: result.message || result.detail || "Registration failed",
        data: null,
        fieldErrors: null,
      }
    }

    // Handle other error cases
    return {
      success: false,
      error: result.message || result.detail || `Registration failed with status ${response.status}`,
      data: null,
      fieldErrors: null,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
      fieldErrors: null,
    }
  }
}

export async function verifyEmail(data: VerifyEmailData) {
  try {
    console.log("Sending email verification request:", data)

    const response = await fetch(`${API_BASE_URL}/users/verify_email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const responseText = await response.text()
    console.log("Verification API Response status:", response.status)
    console.log("Verification API Response text:", responseText)

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse verification response:", e)
      return { success: false, error: "Invalid response from server" }
    }

    if (response.ok) {
      return {
        success: true,
        message: result.message || "Email verified successfully",
        error: null,
      }
    }

    return {
      success: false,
      error: result.message || result.detail || "Verification failed",
    }
  } catch (error) {
    console.error("Verification error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function loginUser(data: LoginData) {
  try {
    console.log("Sending login request:", { email: data.email, password: "***" })

    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const responseText = await response.text()
    console.log("Login API Response status:", response.status)
    console.log("Login API Response text:", responseText)

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse login response:", e)
      return {
        success: false,
        error: "Invalid response from server",
        data: null,
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.detail || "Login failed",
        data: null,
      }
    }

    if (!result.data?.access_token || !result.data?.refresh_token || !result.data?.user) {
      return {
        success: false,
        error: "Invalid response from server. Missing authentication data.",
        data: null,
      }
    }

    // Check if email is verified before allowing login
    if (result.data.user.email_verified === false) {
      return {
        success: false,
        error: "Email not verified. Please check your email for verification code.",
        data: null,
        requiresVerification: true,
      }
    }

    // Set auth cookies only after successful login with verified email
    await setAuthCookies(result.data.access_token, result.data.refresh_token, result.data.user)

    // Also store in localStorage for client-side access
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", result.data.access_token)
      localStorage.setItem("refresh_token", result.data.refresh_token)
      localStorage.setItem("user", JSON.stringify(result.data.user))
    }

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/profile")

    return { success: true, error: null, data: result.data }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
    }
  }
}

export async function googleLogin(data: GoogleLoginData) {
  try {
    // Try to log in the user with their Google email
    const loginResponse = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: data.email, password: "" }),
      cache: "no-store",
    })

    const loginResponseText = await loginResponse.text()

    let result
    try {
      result = JSON.parse(loginResponseText)
    } catch (e) {
      console.error("Failed to parse Google login response:", e)
      return {
        success: false,
        error: "Invalid response from server",
        data: null,
      }
    }

    if (!loginResponse.ok) {
      // If login fails, try to register the user
      const randomPassword = crypto.randomUUID()
      const registerResponse = await fetch(`${API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          password: randomPassword,
          password2: randomPassword,
        }),
        cache: "no-store",
      })

      const registerResponseText = await registerResponse.text()

      try {
        result = JSON.parse(registerResponseText)
      } catch (e) {
        console.error("Failed to parse Google registration response:", e)
        return {
          success: false,
          error: "Invalid response from server",
          data: null,
        }
      }

      if (!registerResponse.ok) {
        console.error("Registration API error:", result)
        return {
          success: false,
          error: result.message || result.detail || `Registration failed: ${JSON.stringify(result)}`,
          data: null,
        }
      }
    }

    if (!result.data?.access_token || !result.data?.refresh_token || !result.data?.user) {
      console.error("Invalid API response:", result)
      return {
        success: false,
        error: "Invalid response from server. Missing authentication data.",
        data: null,
      }
    }

    // Check if email is verified
    if (result.data.user.email_verified === false) {
      return {
        success: false,
        error: "Email not verified. Please check your email for verification code.",
        data: null,
        requiresVerification: true,
      }
    }

    await setAuthCookies(result.data.access_token, result.data.refresh_token, result.data.user)

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", result.data.access_token)
      localStorage.setItem("refresh_token", result.data.refresh_token)
      localStorage.setItem("user", JSON.stringify(result.data.user))
    }

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/profile")

    return { success: true, error: null, data: result.data }
  } catch (error) {
    console.error("Google login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
    }
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value
    const accessToken = cookieStore.get("access_token")?.value

    if (!refreshToken) {
      await clearAuthCookies()
      revalidatePath("/")
      return { success: false, error: "No refresh token found" }
    }

    const response = await fetch(`${API_BASE_URL}/users/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken || ""}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    })

    await clearAuthCookies()
    revalidatePath("/")

    if (!response.ok) {
      const responseText = await response.text()
      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        return { success: false, error: "Logout failed" }
      }

      return {
        success: false,
        error: result.message || result.detail || "Logout failed",
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Logout error:", error)
    await clearAuthCookies()
    revalidatePath("/")
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")?.value

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie) as User
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return !!cookieStore.get("access_token")?.value
}

export async function getClientToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value || null
}
