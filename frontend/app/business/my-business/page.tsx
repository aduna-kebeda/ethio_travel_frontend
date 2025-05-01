"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { CheckCircle, Clock, Edit, Eye, MoreVertical, PlusCircle, Trash2, XCircle } from "lucide-react";

export default function MyBusinessPage() {
  // Mock data - in a real app, this would come from an API
  const [myBusinesses, setMyBusinesses] = useState([
    {
      id: "b1",
      name: "Addis Ababa Tour Guide",
      category: "Tour Guide",
      status: "pending",
      createdAt: "2023-11-15",
    },
    {
      id: "b2",
      name: "Ethiopian Souvenir Shop",
      category: "Souvenir Shop",
      status: "rejected",
      createdAt: "2023-10-28",
      rejectionReason:
        "Insufficient business information provided. Please update your listing with more details about your products and services.",
    },
    {
      id: "b3",
      name: "Lalibela Guest House",
      category: "Hotel",
      status: "approved",
      createdAt: "2023-09-05",
    },
  ]);

  const handleDelete = (id: string) => {
    setMyBusinesses((prev) => prev.filter((business) => business.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-primary/20 text-green-800 hover:bg-primary/20 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-50 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-800 border-red-200 hover:bg-red-50 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderRejectedListings = () => {
    const rejectedBusinesses = myBusinesses.filter((b) => b.status === "rejected");

    if (rejectedBusinesses.length === 0) return null;

    return (
      <Card className="mt-6 border-red-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-700 text-lg">Rejected Listings</CardTitle>
          <CardDescription>
            The following listings were rejected. Please review the feedback and update your information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rejectedBusinesses.map((business) => (
            <div key={business.id} className="p-4 bg-red-50 rounded-md mb-3 last:mb-0">
              <h3 className="font-medium text-gray-900">{business.name}</h3>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">Reason:</span> {business.rejectionReason}
              </p>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="h-8">
                  <Edit className="mr-2 h-3 w-3" />
                  Update Listing
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

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
                      <TableCell>{business.category}</TableCell>
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      <TableCell>{business.createdAt}</TableCell>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
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
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDelete(business.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
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

        {renderRejectedListings()}
      </div>
    </Container>
  );
}