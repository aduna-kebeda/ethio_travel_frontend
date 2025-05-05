"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from cookies
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Try to get user from cookie
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="))
          ?.split("=")[1]

        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie))
          setUser(userData)
        } else {
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
      if (event.key === "authState") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [pathname])

  const login = (userData: User) => {
    setUser(userData)
    // Store in localStorage for cross-tab synchronization
    localStorage.setItem("authState", "authenticated")
  }

  const logout = () => {
    setUser(null)
    // Clear from localStorage
    localStorage.removeItem("authState")
    // Redirect to login
    router.push("/login")
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
        }}
      >
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  )
}
export default AuthProvider
