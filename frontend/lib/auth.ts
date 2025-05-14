// lib/auth.ts
import type { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, googleLogin } from "@/app/actions/auth-actions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const result = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });
        if (!result.success || !result.data?.user) {
          return null;
        }
        return {
          id: result.data.user.id,
          name: result.data.user.username,
          email: result.data.user.email,
          image: result.data.user.image || "/placeholder.svg?height=40&width=40",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === "google" && profile) {
        try {
          const googleUser = {
            email: profile.email ?? "",
            username: profile.name || profile.email?.split("@")[0] || "google_user",
            first_name: (profile as any).given_name || "",
            last_name: (profile as any).family_name || "",
            role: "user",
          };
          const result = await googleLogin(googleUser);
          if (result.success && result.data?.user) {
            token.sub = result.data.user.id;
            token.access_token = result.data.access_token;
            token.refresh_token = result.data.refresh_token;
          } else {
            console.error("Google login failed:", result.error);
            throw new Error(`Google authentication failed: ${result.error}`);
          }
        } catch (error) {
          console.error("JWT callback error:", error);
          throw new Error(`Google authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      } else if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};