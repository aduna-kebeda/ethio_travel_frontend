"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { logoutUser } from "@/app/actions/auth-actions"

interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  role?: string
  profile_image?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  getAccessToken: () => null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from cookies and localStorage
  useEffect(() => {
    const checkAuth = () => {
      try {
        // First try localStorage (more reliable in development)
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            console.log("Found user data in localStorage:", userData.username)
            setUser(userData)
            return
          } catch (e) {
            console.error("Error parsing user data from localStorage:", e)
          }
        }

        // Fallback to cookies
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="))
          ?.split("=")[1]

        if (userCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userCookie))
            console.log("Found user data in cookie:", userData.username)
            setUser(userData)
          } catch (e) {
            console.error("Error parsing user data from cookie:", e)
            setUser(null)
          }
        } else {
          console.log("No user data found in cookies or localStorage")
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authState" || event.key === "user" || event.key === "access_token") {
        checkAuth()
      }
    }

    const handleAuthStateChange = () => {
      checkAuth()
    }

    // Check auth state periodically (every 30 seconds)
    const intervalId = setInterval(checkAuth, 30000)

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("auth-state-changed", handleAuthStateChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("auth-state-changed", handleAuthStateChange)
      clearInterval(intervalId)
    }
  }, [pathname])

  const login = (userData: User) => {
    console.log("Login called with user:", userData.username)
    setUser(userData)
    // Store in localStorage for cross-tab synchronization and more reliable access
    localStorage.setItem("authState", "authenticated")
    localStorage.setItem("user", JSON.stringify(userData))
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event("auth-state-changed"))
  }

  const logout = async () => {
    try {
      console.log("Logout called")
      // Call the server action to clear cookies
      await logoutUser()

      // Clear localStorage
      localStorage.removeItem("authState")
      localStorage.removeItem("user")
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    } catch (error) {
      console.error("Error during logout:", error)
    }

    // Clear local state
    setUser(null)

    // Dispatch event for other components
    window.dispatchEvent(new Event("auth-state-changed"))

    // Redirect to login
    router.push("/login")
  }

  // Update the getAccessToken function to prioritize localStorage
  const getAccessToken = (): string | null => {
    // First try localStorage (more reliable in development)
    if (typeof window !== "undefined") {
      const localStorageToken = localStorage.getItem("access_token")
      if (localStorageToken && localStorageToken !== "undefined" && localStorageToken !== "null") {
        return localStorageToken
      }

      // Fallback to cookies
      try {
        const cookies = document.cookie.split(";")
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="))
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1].trim()
          if (token && token !== "undefined" && token !== "null") {
            return token
          }
        }
      } catch (error) {
        console.error("Error retrieving access token from cookies:", error)
      }

      // Last resort: environment variable
      if (process.env.NEXT_PUBLIC_JWT_TOKEN) {
        return process.env.NEXT_PUBLIC_JWT_TOKEN
      }
    }
    return null
  }

  return (
    <SessionProvider>
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated: !!user,
          isLoading,
          login,
          logout,
          getAccessToken,
        }}
      >
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  )
}
export default AuthProvider
