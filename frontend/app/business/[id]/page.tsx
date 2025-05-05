import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Wifi,
} from "lucide-react";
import { getBusinessById } from "@/app/actions/business-actions";
import { getBusinessReviews } from "@/app/actions/review-actions";
import { ReviewList } from "../components/review-list";
import { ReviewForm } from "../components/review-form";

interface BusinessDetailPageProps {
  params: {
    id: string;
  };
}

// Explicitly export as default to ensure Next.js recognizes it as a React component
export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  // Validate ID to prevent invalid routes (e.g., logo.png)
  if (!/^\d+$/.test(params.id)) {
    notFound();
  }

  // Fetch business data
  const business = await getBusinessById(params.id);

  if (!business) {
    notFound();
  }

  // Get reviews - use empty array as fallback if API fails
  let reviews: any[] = [];
  try {
    const reviewsResult = await getBusinessReviews(params.id);
    if (reviewsResult.success) {
      reviews = reviewsResult.data || [];
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  // Format facilities as an array
  const facilitiesList = business?.facilities
    ? typeof business.facilities === "string"
      ? business.facilities.split(",").map((item: string) => item.trim())
      : Array.isArray(business.facilities)
      ? business.facilities
      : []
    : [];

  // Process gallery images - handle the string format from API
  let galleryImagesArray: string[] = [];
  if (business?.galleryImages) {
    if (typeof business.galleryImages === "string") {
      galleryImagesArray = business.galleryImages
        .split(",")
        .map((url: string) => url.trim())
        .filter(Boolean);
    } else if (Array.isArray(business.galleryImages)) {
      galleryImagesArray = business.galleryImages
        .map((image: string | File) => (image instanceof File ? URL.createObjectURL(image) : image))
        .filter(Boolean);
    }
  }

  // If no gallery images, use placeholder images
  if (galleryImagesArray.length === 0) {
    galleryImagesArray = [
      `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName || "Business")}+1`,
      `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName || "Business")}+2`,
      `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName || "Business")}+3`,
      `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(business?.businessName || "Business")}+4`,
    ];
  }

  // Normalize business data structure
  const businessName = business?.businessName || "Unknown Business";
  const businessType = business?.businessType || "Unknown Type";
  const description = business?.description || "No description available.";
  const address = business?.address || "No address provided.";
  const city = business?.city || "";
  const region = business?.region || "";
  const phone = business?.phone || "";
  const email = business?.email || "";
  const website = business?.website || "";
  const mainImage =
    typeof business?.mainImage === "string" && business.mainImage
      ? business.mainImage
      : business?.mainImage instanceof File
      ? URL.createObjectURL(business.mainImage)
      : "/placeholder.svg";
  const openingHours = business?.openingHours || "";
  const verified = business?.verified || false;
  const rating = business?.rating ? Number(business.rating).toFixed(1) : "New";
  const totalReviews = business?.totalReviews || (reviews ? reviews.length : 0);
  const latitude = business?.latitude || "9.0222";
  const longitude = business?.longitude || "38.7468";

  // Social media links
  const facebook = business?.facebook || "";
  const instagram = business?.instagram || "";
  const socialMediaLinks = business?.socialMediaLinks
    ? typeof business.socialMediaLinks === "string"
      ? business.socialMediaLinks.split(",").filter(Boolean)
      : Array.isArray(business.socialMediaLinks)
      ? business.socialMediaLinks
      : []
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={mainImage}
            alt={businessName}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Container className="relative h-full flex flex-col justify-end pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-primary hover:bg-primary/90">{businessType}</Badge>
              {verified && (
                <Badge variant="secondary" className="bg-white text-primary flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified</span>
                </Badge>
              )}
              {!verified && (
                <Badge variant="outline" className="bg-white/80 text-yellow-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Pending Verification</span>
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{businessName}</h1>
            <div className="flex items-center text-white mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{address}</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-white/70" />
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                <span>
                  {rating} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-3">Description</h2>
                    <p className="text-gray-700">{description}</p>
                  </div>

                  {facilitiesList.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-3">Facilities & Amenities</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {facilitiesList.map((facility: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <Wifi className="h-4 w-4 text-primary mr-2" />
                            <span className="text-gray-700">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {openingHours && (
                    <div>
                      <h2 className="text-xl font-bold mb-3">Opening Hours</h2>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <span>{openingHours}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  <h2 className="text-xl font-bold mb-3">Photo Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryImagesArray.map((imageUrl, index) => (
                      <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`${businessName} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <h2 className="text-xl font-bold mb-3">Location</h2>
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      title={`${businessName} location`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span>
                      {address}, {city}, {region}
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Reviews & Ratings</h2>
                  </div>

                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                    <ReviewForm businessId={params.id} />
                  </div>

                  <h3 className="text-lg font-medium mb-4">Customer Reviews ({totalReviews})</h3>
                  <ReviewList reviews={reviews || []} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Contact Information</h2>

                  <div className="space-y-3">
                    {phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-primary mr-3" />
                        <a href={`tel:${phone}`} className="text-gray-700 hover:text-primary">
                          {phone}
                        </a>
                      </div>
                    )}

                    {email && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-primary mr-3" />
                        <a href={`mailto:${email}`} className="text-gray-700 hover:text-primary">
                          {email}
                        </a>
                      </div>
                    )}

                    {website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-primary mr-3" />
                        <a
                          href={website.startsWith("http") ? website : `https://${website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-primary"
                        >
                          {website}
                        </a>
                      </div>
                    )}
                  </div>

                  {(facebook || instagram || socialMediaLinks.length > 0) && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Social Media</h3>
                      <div className="flex gap-2">
                        {facebook && (
                          <a
                            href={facebook.startsWith("http") ? facebook : `https://${facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Facebook className="h-5 w-5 text-blue-600" />
                          </a>
                        )}

                        {instagram && (
                          <a
                            href={instagram.startsWith("http") ? instagram : `https://${instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Instagram className="h-5 w-5 text-pink-600" />
                          </a>
                        )}

                        {socialMediaLinks.map((link, index) => {
                          if (link.includes("facebook") || link.includes("instagram")) return null;
                          return (
                            <a
                              key={index}
                              href={link.startsWith("http") ? link : `https://${link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <Globe className="h-5 w-5 text-gray-600" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Business Details</h2>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">{businessType}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">
                        {city}, {region}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">
                        Listed since{" "}
                        {business?.createdAt
                          ? new Date(business.createdAt).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <CheckCircle
                        className={`h-5 w-5 ${verified ? "text-green-500" : "text-yellow-500"} mr-3`}
                      />
                      <span className="text-gray-700">
                        {verified ? "Verified Business" : "Verification Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button className="w-full bg-primary hover:bg-primary/90">Contact Business</Button>

                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>

                    <div className="text-center mt-2">
                      <Link href="/business/claim" className="text-sm text-primary hover:underline">
                        Is this your business? Claim it now
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold text-primary mb-2">Advertise with us</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Boost your visibility and reach more customers by promoting your business.
                </p>
                <Link href="/business/advertise">
                  <Button className="w-full bg-primary hover:bg-primary/90">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}