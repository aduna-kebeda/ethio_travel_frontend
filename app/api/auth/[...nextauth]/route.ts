import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Export a simple handler without additional configuration
// to minimize potential issues
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
