"use client"

import { useEffect, useState } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Edit, Trash2, Star, MapPin, Phone, Mail, Globe, Clock } from "lucide-react"
import Link from "next/link"
import { fetchBusinesses } from "@/app/actions/business-actions"
import { useToast } from "@/hooks/use-toast"

export default function MyBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setIsLoading(true)
        const result = await fetchBusinesses()

        if (result.success) {
          setBusinesses(result.data.results || [])
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load businesses",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading businesses:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBusinesses()
  }, [toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Container className="py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
            <p className="text-gray-600 mt-1">Manage your registered businesses</p>
          </div>
          <Link href="/business/register">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add New Business
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-20 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-6">You haven't registered any businesses yet.</p>
              <Link href="/business/register">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Register a Business
                </Button>
              </Link>
            </div>
          ) : (
            <TabsContent value="all" className="space-y-6">
              {businesses.map((business) => (
                <Card key={business.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-48 md:h-auto">
                      <img
                        src={business.main_image || "/placeholder.svg?height=300&width=400&text=No+Image"}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full md:w-2/3 p-0">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{business.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Badge variant="outline" className="mr-2">
                                {business.business_type}
                              </Badge>
                              {getStatusBadge(business.status)}
                            </CardDescription>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center mr-4">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{business.average_rating || "0.0"}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{business.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="truncate">{business.address}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{business.contact_phone}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="truncate">{business.contact_email}</span>
                          </div>
                          {business.website && (
                            <div className="flex items-center text-gray-600">
                              <Globe className="h-4 w-4 mr-2" />
                              <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate hover:text-primary"
                              >
                                {business.website.replace(/^https?:\/\//, "")}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Created: {new Date(business.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/business/${business.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/business/edit/${business.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your business listing and
                                  remove it from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          )}

          <TabsContent value="active" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : businesses.filter((b) => b.status === "active").length === 0 ? (
              <div className="text-center py-20 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active businesses</h3>
                <p className="text-gray-600">You don't have any active business listings yet.</p>
              </div>
            ) : (
              businesses
                .filter((business) => business.status === "active")
                .map((business) => (
                  // Same card component as above
                  <Card key={business.id}>...</Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : businesses.filter((b) => b.status === "pending").length === 0 ? (
              <div className="text-center py-20 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending businesses</h3>
                <p className="text-gray-600">You don't have any pending business listings.</p>
              </div>
            ) : (
              businesses
                .filter((business) => business.status === "pending")
                .map((business) => (
                  // Same card component as above
                  <Card key={business.id}>...</Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
