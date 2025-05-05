import { cookies } from "next/headers"

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    const refreshToken = cookieStore.get("refresh_token")?.value
    const userCookie = cookieStore.get("user")?.value

    if (!accessToken) {
      return null
    }

    let user = null
    if (userCookie) {
      try {
        user = JSON.parse(userCookie)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    return {
      accessToken,
      refreshToken,
      user,
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.accessToken
}
