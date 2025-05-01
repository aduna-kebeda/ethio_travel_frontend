"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, User, Menu, X, Building2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  user?: {
    name: string
    image?: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Packages", href: "/packages" },
    { name: "Business", href: "/business" },
    { name: "Blog", href: "/blog" },
  ]

  const handleNavigation = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex md:items-center md:justify-center md:flex-1 md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-1 py-2 text-sm font-semibold transition-colors hover:text-primary group",
                  pathname === item.href ? "text-primary" : "text-secondary",
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative rounded-md">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </Button>

                <div className="hidden md:flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center rounded-md">
                        <Building2 className="h-4 w-4 mr-2" />
                        My Business
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Business Menu</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/business/my-business">My Listings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/business/register">Add New Business</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/business">Browse Directory</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white overflow-hidden">
                        {user.image ? (
                          <img
                            src={user.image || "/placeholder.svg"}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/business/my-business">My Business</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/logout">Logout</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="rounded-md">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-base font-semibold relative",
                    pathname === item.href ? "text-primary" : "text-gray-700 hover:text-primary",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary" />
                  )}
                </Link>
              ))}
              {user && (
                <Link
                  href="/business/my-business"
                  className="px-3 py-2 text-base font-semibold text-gray-700 hover:text-primary relative"
                  onClick={() => setIsOpen(false)}
                >
                  My Business
                  {pathname === "/business/my-business" && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary" />
                  )}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}