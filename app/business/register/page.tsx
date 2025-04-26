"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Phone, Mail, Globe, Facebook, Instagram, Clock, Loader2, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/upload-file"

// Business types and regions data
const businessTypes = [
  "Hotel",
  "Restaurant",
  "Travel Agency",
  "Resort",
  "Lodge",
  "Tour Guide",
  "Souvenir Shop",
  "Transportation",
  "Other",
]

const regions = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "Southern Nations, Nationalities, and Peoples",
  "Tigray",
]

// Cities by region
const cities: Record<string, string[]> = {
  "Addis Ababa": ["Addis Ababa"],
  Amhara: ["Bahir Dar", "Gondar", "Lalibela", "Dessie"],
  Tigray: ["Mekelle", "Axum", "Adwa"],
  Oromia: ["Adama", "Jimma", "Nekemte"],
  Sidama: ["Hawassa"],
  "Southern Nations, Nationalities, and Peoples": ["Arba Minch", "Sodo", "Dilla"],
  Somali: ["Jijiga"],
  Afar: ["Semera"],
  "Benishangul-Gumuz": ["Assosa"],
  Gambela: ["Gambela"],
  Harari: ["Harar"],
  "Dire Dawa": ["Dire Dawa"],
}

export default function RegisterBusinessPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [businessImage, setBusinessImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    region: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    openingHours: "",
    facilities: "",
    termsAccepted: false,
    imageUrl: "",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field when user makes changes
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (field === "region") {
      setSelectedRegion(value as string)
      setFormData((prev) => ({
        ...prev,
        city: "",
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setBusinessImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Basic information validation
    if (!formData.businessName.trim()) errors.businessName = "Business name is required"
    if (!formData.businessType) errors.businessType = "Business type is required"
    if (!formData.description.trim()) errors.description = "Description is required"

    // Contact & Location validation
    if (!formData.region) errors.region = "Region is required"
    if (!formData.city) errors.city = "City is required"
    if (!formData.address.trim()) errors.address = "Address is required"
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Invalid email format"

    // Terms validation
    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the terms and conditions"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please correct the errors in the form",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Upload image if selected
      if (businessImage) {
        setIsUploading(true)
        const imageUrl = await uploadFile(businessImage, "businesses", (progress) => {
          setUploadProgress(progress)
        })
        setFormData((prev) => ({ ...prev, imageUrl }))
        setIsUploading(false)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Business registered",
        description: "Your business has been registered successfully.",
      })

      router.push("/business/register/success")
    } catch (error) {
      console.error("Error registering business:", error)
      toast({
        title: "Registration failed",
        description: "Failed to register business. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "basic") {
      // Validate basic information before proceeding
      const basicErrors: Record<string, string> = {}
      if (!formData.businessName.trim()) basicErrors.businessName = "Business name is required"
      if (!formData.businessType) basicErrors.businessType = "Business type is required"
      if (!formData.description.trim()) basicErrors.description = "Description is required"

      if (Object.keys(basicErrors).length > 0) {
        setFormErrors((prev) => ({ ...prev, ...basicErrors }))
        return
      }

      setActiveTab("contact")
    } else if (activeTab === "contact") {
      // Validate contact information before proceeding
      const contactErrors: Record<string, string> = {}
      if (!formData.region) contactErrors.region = "Region is required"
      if (!formData.city) contactErrors.city = "City is required"
      if (!formData.address.trim()) contactErrors.address = "Address is required"
      if (!formData.phone.trim()) contactErrors.phone = "Phone number is required"
      if (!formData.email.trim()) contactErrors.email = "Email is required"
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) contactErrors.email = "Invalid email format"

      if (Object.keys(contactErrors).length > 0) {
        setFormErrors((prev) => ({ ...prev, ...contactErrors }))
        return
      }

      setActiveTab("additional")
    }
  }

  const prevTab = () => {
    if (activeTab === "additional") setActiveTab("contact")
    else if (activeTab === "contact") setActiveTab("basic")
  }

  return (
    <Container className="py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Business</h1>
          <p className="text-gray-600">Join our directory and reach thousands of travelers exploring Ethiopia</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Fill out the form below to register your business. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="contact">Contact & Location</TabsTrigger>
                  <TabsTrigger value="additional">Additional Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName" className="flex items-center">
                        Business Name <span className="text-red-500 ml-1">*</span>
                        {formErrors.businessName && (
                          <span className="text-red-500 text-xs ml-2">{formErrors.businessName}</span>
                        )}
                      </Label>
                      <div className="flex items-center mt-1">
                        <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => handleChange("businessName", e.target.value)}
                          placeholder="Enter your business name"
                          className={formErrors.businessName ? "border-red-500" : ""}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessType" className="flex items-center">
                        Business Type <span className="text-red-500 ml-1">*</span>
                        {formErrors.businessType && (
                          <span className="text-red-500 text-xs ml-2">{formErrors.businessType}</span>
                        )}
                      </Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => handleChange("businessType", value)}
                      >
                        <SelectTrigger id="businessType" className={formErrors.businessType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="flex items-center">
                        Description <span className="text-red-500 ml-1">*</span>
                        {formErrors.description && (
                          <span className="text-red-500 text-xs ml-2">{formErrors.description}</span>
                        )}
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Describe your business (services, features, etc.)"
                        className={`min-h-[120px] ${formErrors.description ? "border-red-500" : ""}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessImage">Business Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Business preview"
                              className="h-40 mx-auto object-contain rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full"
                              onClick={() => {
                                setImagePreview(null)
                                setBusinessImage(null)
                              }}
                              disabled={isUploading || isSubmitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Upload a photo of your business</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading || isSubmitting}
                            >
                              Select Image
                            </Button>
                          </>
                        )}

                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                            <div className="text-white text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                              <p className="text-sm">{Math.round(uploadProgress)}%</p>
                            </div>
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          id="businessImage"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isUploading || isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={nextTab}
                      className="bg-primary hover:bg-primary/90"
                      disabled={isUploading || isSubmitting}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region" className="flex items-center">
                        Region <span className="text-red-500 ml-1">*</span>
                        {formErrors.region && <span className="text-red-500 text-xs ml-2">{formErrors.region}</span>}
                      </Label>
                      <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
                        <SelectTrigger id="region" className={formErrors.region ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="city" className="flex items-center">
                        City <span className="text-red-500 ml-1">*</span>
                        {formErrors.city && <span className="text-red-500 text-xs ml-2">{formErrors.city}</span>}
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => handleChange("city", value)}
                        disabled={!selectedRegion}
                      >
                        <SelectTrigger id="city" className={formErrors.city ? "border-red-500" : ""}>
                          <SelectValue placeholder={selectedRegion ? "Select city" : "Select region first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRegion &&
                            cities[selectedRegion as keyof typeof cities]?.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center">
                      Address <span className="text-red-500 ml-1">*</span>
                      {formErrors.address && <span className="text-red-500 text-xs ml-2">{formErrors.address}</span>}
                    </Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Street address"
                        className={formErrors.address ? "border-red-500" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center">
                      Phone Number <span className="text-red-500 ml-1">*</span>
                      {formErrors.phone && <span className="text-red-500 text-xs ml-2">{formErrors.phone}</span>}
                    </Label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+251 XX XXX XXXX"
                        className={formErrors.phone ? "border-red-500" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center">
                      Email <span className="text-red-500 ml-1">*</span>
                      {formErrors.email && <span className="text-red-500 text-xs ml-2">{formErrors.email}</span>}
                    </Label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab} disabled={isUploading || isSubmitting}>
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={nextTab}
                      className="bg-primary hover:bg-primary/90"
                      disabled={isUploading || isSubmitting}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center mt-1">
                      <Globe className="w-5 h-5 text-gray-400 mr-2" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        placeholder="www.yourbusiness.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <div className="flex items-center mt-1">
                        <Facebook className="w-5 h-5 text-gray-400 mr-2" />
                        <Input
                          id="facebook"
                          value={formData.facebook}
                          onChange={(e) => handleChange("facebook", e.target.value)}
                          placeholder="facebook.com/yourbusiness"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="flex items-center mt-1">
                        <Instagram className="w-5 h-5 text-gray-400 mr-2" />
                        <Input
                          id="instagram"
                          value={formData.instagram}
                          onChange={(e) => handleChange("instagram", e.target.value)}
                          placeholder="instagram.com/yourbusiness"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="openingHours">Opening Hours</Label>
                    <div className="flex items-center mt-1">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <Input
                        id="openingHours"
                        value={formData.openingHours}
                        onChange={(e) => handleChange("openingHours", e.target.value)}
                        placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-3PM"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facilities">Facilities & Amenities</Label>
                    <Textarea
                      id="facilities"
                      value={formData.facilities}
                      onChange={(e) => handleChange("facilities", e.target.value)}
                      placeholder="List facilities and amenities (e.g., WiFi, Parking, Restaurant)"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex items-start space-x-2 pt-4">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleChange("termsAccepted", checked === true)}
                      className={formErrors.termsAccepted ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          formErrors.termsAccepted ? "text-red-500" : ""
                        }`}
                      >
                        Terms and Conditions <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-500">
                        I agree to the terms of service and privacy policy. I confirm that all information provided is
                        accurate.
                      </p>
                      {formErrors.termsAccepted && <p className="text-red-500 text-xs">{formErrors.termsAccepted}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab} disabled={isUploading || isSubmitting}>
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUploading || isSubmitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register Business"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Note:</span> All businesses will be reviewed before being published in our
              directory. This process typically takes 1-2 business days.
            </p>
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@ethiotravel.com" className="text-primary hover:underline">
                support@ethiotravel.com
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Container>
  )
}
