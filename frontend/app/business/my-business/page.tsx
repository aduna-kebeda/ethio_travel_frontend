"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle, Clock, Edit, Eye, MoreVertical, PlusCircle, Trash2, XCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

interface Business {
  id: number
  name: string
  business_type: string
  status: "approved" | "pending" | "rejected"
  created_at: string
  slug?: string
  description?: string
  contact_email?: string
  contact_phone?: string
  website?: string | null
  region?: string
  city?: string
  address?: string
  latitude?: string
  longitude?: string
  main_image?: string
  gallery_images?: string
  social_media_links?: string | object
  opening_hours?: string
  facilities?: string
  services?: string
  team?: string | any[]
  is_verified?: boolean
  is_featured?: boolean
  verification_date?: string | null
  average_rating?: string
  total_reviews?: number
  updated_at?: string
}

export default function MyBusinessPage() {
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getAccessToken } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Memoize fetchBusinesses to ensure stability
  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getAccessToken()
      if (!token) {
        setError("You must be logged in to view your businesses. Please log in and try again.")
        toast({
          title: "Authentication Error",
          description: "Please log in to access your businesses.",
          variant: "destructive",
          action: <Button onClick={() => router.push("/login")}>Log In</Button>,
        })
        return
      }

      console.log("Fetching businesses with token:", token.substring(0, 10) + "...") // Debug log

      const response = await fetch(
        "https://ai-driven-travel.onrender.com/api/business/businesses/my-businesses/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        let errorMessage = "Failed to fetch businesses"
        if (response.status === 401) {
          errorMessage = "Unauthorized: Invalid or expired token. Please log in again."
          toast({
            title: "Unauthorized",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
            action: <Button onClick={() => router.push("/login")}>Log In</Button>,
          })
        } else if (response.status === 403) {
          errorMessage = "Forbidden: You do not have permission to access this resource."
        } else if (response.status === 404) {
          errorMessage = "No businesses found for your account."
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("API response:", data) // Debug log

      if (!Array.isArray(data)) {
        throw new Error("Unexpected API response: Expected an array of businesses")
      }

      setMyBusinesses(data)
    } catch (error: any) {
      console.error("Error fetching businesses:", error)
      setError(error.message || "Failed to load businesses. Please try again later.")
      toast({
        title: "Error",
        description: error.message || "Failed to load businesses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [getAccessToken, toast, router])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  const handleDelete = async (id: number) => {
    try {
      const token = getAccessToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to delete a business.",
          variant: "destructive",
          action: <Button onClick={() => router.push("/login")}>Log In</Button>,
        })
        return
      }

      console.log("Deleting business with ID:", id, "with token:", token.substring(0, 10) + "...") // Debug log

      const response = await fetch(
        `https://ai-driven-travel.onrender.com/api/business/businesses/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )

      if (response.status === 204) {
        // Successful deletion
        setMyBusinesses((prev) => prev.filter((business) => business.id !== id))
        toast({
          title: "Success",
          description: "Business deleted successfully.",
        })
      } else if (response.status === 404) {
        throw new Error("Business not found. It may have already been deleted.")
      } else if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token. Please log in again.")
      } else if (response.status === 403) {
        throw new Error("Forbidden: You do not have permission to delete this business.")
      } else {
        throw new Error("Failed to delete business")
      }
    } catch (error: any) {
      console.error("Error deleting business:", error)
      let errorMessage = error.message || "Failed to delete business. Please try again."
      if (error.message.includes("Unauthorized")) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          action: <Button onClick={() => router.push("/login")}>Log In</Button>,
        })
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  const handlePreview = (id: number) => {
    router.push(`/business/preview/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/business/edit/${id}`)
  }

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified) {
        return (
          <Badge className="bg-primary/20 text-green-800 hover:bg-primary/20 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )
    }

    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-50 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-800 border-red-200 hover:bg-red-50 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <Container className="py-10">
        <div className="text-center">
          <p>Loading your businesses...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4 pt-2">
            <Button onClick={() => fetchBusinesses()} className="bg-primary hover:bg-primary/90">
              Try Again
            </Button>
            {error.includes("log in") && (
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Log In
              </Button>
            )}
          </CardFooter>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>
            <p className="text-gray-600 mt-1">Manage your registered businesses and track their status</p>
          </div>

          <Link href="/business/register">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Register New Business
            </Button>
          </Link>
        </div>

        {myBusinesses.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>No Businesses Found</CardTitle>
              <CardDescription>You haven't registered any businesses yet.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pt-2">
              <Link href="/business/register">
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Register Your First Business
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Registered Businesses</CardTitle>
              <CardDescription>View and manage all your business listings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell>{business.business_type}</TableCell>
                      <TableCell>{getStatusBadge(business.status, business.is_verified || false)}</TableCell>
                      <TableCell>{new Date(business.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePreview(business.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(business.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete your business listing. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex justify-end gap-2">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDelete(business.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  )
}