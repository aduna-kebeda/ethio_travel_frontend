"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { deleteBusiness } from "@/app/actions/business-actions"

// Mock business data
const mockBusinesses = [
  {
    id: "1",
    businessName: "Sheraton Addis",
    businessType: "Hotel",
    description: "Luxury hotel in the heart of Addis Ababa with world-class restaurants and a spa.",
    region: "Addis Ababa",
    city: "Addis Ababa",
    verified: true,
    createdAt: "2023-05-15T10:30:00Z",
    image: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
    views: 1245,
    clicks: 320,
  },
  {
    id: "2",
    businessName: "Yod Abyssinia Cultural Restaurant",
    businessType: "Restaurant",
    description: "Traditional Ethiopian restaurant with cultural performances and authentic cuisine.",
    region: "Addis Ababa",
    city: "Addis Ababa",
    verified: false,
    status: "pending",
    createdAt: "2023-06-20T14:15:00Z",
    image: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
    views: 890,
    clicks: 210,
  },
  {
    id: "3",
    businessName: "Ethiopia Travel Agency",
    businessType: "Travel Agency",
    description: "Full-service tour operator specializing in cultural and historical tours of Ethiopia.",
    region: "Amhara",
    city: "Bahir Dar",
    verified: false,
    status: "rejected",
    rejectionReason: "Business information incomplete. Please provide more details about your services.",
    createdAt: "2023-07-05T09:45:00Z",
    image: "/placeholder.svg?height=300&width=500&text=Ethiopia+Travel",
    views: 560,
    clicks: 95,
  },
]

export default function MyBusinessesPage() {
  const [businesses, setBusinesses] = useState(mockBusinesses)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDeleteBusiness = async (id: string) => {
    try {
      const result = await deleteBusiness(id)

      if (result.success) {
        // Update local state
        setBusinesses(businesses.filter((business) => business.id !== id))
        setBusinessToDelete(null)
      } else {
        console.error("Failed to delete business:", result.error)
        alert("Failed to delete business. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting business:", error)
      alert("An error occurred while deleting the business.")
    }
  }

  // Filter businesses based on active tab and search query
  const filteredBusinesses = businesses.filter((business) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && business.verified) ||
      (activeTab === "pending" && business.status === "pending") ||
      (activeTab === "rejected" && business.status === "rejected")

    const matchesSearch =
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  // Sort businesses
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === "name-asc") {
      return a.businessName.localeCompare(b.businessName)
    } else if (sortBy === "name-desc") {
      return b.businessName.localeCompare(a.businessName)
    } else if (sortBy === "most-viewed") {
      return b.views - a.views
    }
    return 0
  })

  return (
    <Container className="py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
            <p className="text-gray-600 mt-1">Manage your registered businesses</p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/business/register">
              <Plus className="mr-2 h-4 w-4" />
              Register New Business
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-4 w-4" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 border-b border-gray-200">
              <TabsList className="h-12">
                <TabsTrigger value="all" className="data-[state=active]:text-emerald-600">
                  All
                </TabsTrigger>
                <TabsTrigger value="verified" className="data-[state=active]:text-emerald-600">
                  Verified
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:text-emerald-600">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:text-emerald-600">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your businesses...</p>
                </div>
              ) : sortedBusinesses.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {sortedBusinesses.map((business) => (
                    <div key={business.id} className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4 lg:w-1/5">
                          <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={business.image || "/placeholder.svg"}
                              alt={business.businessName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">{business.businessName}</h3>
                              {business.verified ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              ) : business.status === "pending" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                                >
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending Review
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
                                >
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Rejected
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(business.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building2 className="h-4 w-4" />
                            <span>{business.businessType}</span>
                            <span className="mx-1">•</span>
                            <span>
                              {business.city}, {business.region}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>

                          {business.status === "rejected" && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                              <div className="font-medium mb-1">Rejection Reason:</div>
                              <p>{business.rejectionReason}</p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-3">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/business/${business.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/business/edit/${business.id}`}>
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <AlertDialog
                              open={businessToDelete === business.id}
                              onOpenChange={(open) => !open && setBusinessToDelete(null)}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => setBusinessToDelete(business.id)}
                                >
                                  <Trash2 className="mr-1 h-4 w-4" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete {business.businessName} from our directory. This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteBusiness(business.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            {business.verified && (
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/business/analytics/${business.id}`}>
                                  <BarChart3 className="mr-1 h-4 w-4" />
                                  Analytics
                                </Link>
                              </Button>
                            )}
                          </div>

                          {business.verified && (
                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="mr-1 h-4 w-4 text-gray-400" />
                                {business.views} views
                              </div>
                              <div className="flex items-center">
                                <Search className="mr-1 h-4 w-4 text-gray-400" />
                                {business.clicks} clicks
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="rounded-full bg-gray-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No businesses found</h3>
                  <p className="mt-1 text-gray-500">
                    {searchQuery
                      ? "No businesses match your search criteria."
                      : "You haven't registered any businesses yet."}
                  </p>
                  {!searchQuery && (
                    <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/business/register">
                        <Plus className="mr-2 h-4 w-4" />
                        Register Your First Business
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="verified" className="p-0">
              {/* Same content structure as "all" tab but filtered for verified businesses */}
            </TabsContent>

            <TabsContent value="pending" className="p-0">
              {/* Same content structure as "all" tab but filtered for pending businesses */}
            </TabsContent>

            <TabsContent value="rejected" className="p-0">
              {/* Same content structure as "all" tab but filtered for rejected businesses */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Container>
  )
}
