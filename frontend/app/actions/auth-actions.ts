"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Type definitions for data structures
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
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  [key: string]: unknown // Allow for additional properties
}

const API_BASE_URL = "https://ai-driven-travel.onrender.com/api"

// Helper function to set cookies
const setAuthCookies = async (accessToken: string, refreshToken: string, user?: User) => {
  const cookieStore = await cookies()

  // Set access token cookie
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
  })

  // Set refresh token cookie
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  })

  // Set user data in a client-accessible cookie
  if (user) {
    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: false, // Not HTTP only so client JS can access it
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    })
  }
}

// Helper function to clear cookies
const clearAuthCookies = async () => {
  const cookieStore = await cookies()
  cookieStore.set("access_token", "", { maxAge: -1, path: "/" })
  cookieStore.set("refresh_token", "", { maxAge: -1, path: "/" })
  cookieStore.set("user", "", { maxAge: -1, path: "/" })
}

export async function registerUser(data: RegisterUserData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.message || "Registration failed", data: null }
    }

    await setAuthCookies(result.data.access_token, result.data.refresh_token, result.data.user)
    revalidatePath("/")

    return { success: true, error: null, data: result.data }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An unexpected error occurred", data: null }
  }
}

export async function verifyEmail(data: VerifyEmailData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/verify_email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.message || "Verification failed" }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Verification error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function loginUser(data: LoginData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.message || "Login failed", data: null }
    }

    await setAuthCookies(result.data.access_token, result.data.refresh_token, result.data.user)
    revalidatePath("/")

    return { success: true, error: null, data: result.data }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred", data: null }
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
        Authorization: `Bearer ${accessToken || ""}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    })

    await clearAuthCookies()
    revalidatePath("/")

    if (!response.ok) {
      const result = await response.json()
      return { success: false, error: result.message || "Logout failed" }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Logout error:", error)
    await clearAuthCookies()
    revalidatePath("/")
    return { success: false, error: "An unexpected error occurred" }
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
