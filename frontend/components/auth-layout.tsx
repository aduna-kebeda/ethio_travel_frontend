import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  imagePosition?: "left" | "right"
  imageSrc?: string
}

export function AuthLayout({ children, imagePosition = "right", imageSrc = "/assets/langano3.jpg" }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {imagePosition === "left" && (
        <div className="relative hidden md:block order-first">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={imageSrc || "/placeholder.svg"}
            alt="Ethiopia landscape"
          />
        </div>
      )}

      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto w-full max-w-sm lg:w-[450px]">{children}</div>
      </div>

      {imagePosition === "right" && (
        <div className="relative hidden md:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={imageSrc || "/placeholder.svg"}
            alt="Ethiopia landscape"
          />
        </div>
      )}
    </div>
  )
}
