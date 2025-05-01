"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Globe, Facebook, Instagram, Clock, Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/upload-file";

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
];

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
];

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
};

export default function RegisterBusinessPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [businessImage, setBusinessImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user makes changes
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field === "region") {
      setSelectedRegion(value as string);
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setBusinessImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Basic information validation
    if (!formData.businessName.trim()) errors.businessName = "Business name is required";
    if (!formData.businessType) errors.businessType = "Business type is required";
    if (!formData.description.trim()) errors.description = "Description is required";

    // Contact & Location validation
    if (!formData.region) errors.region = "Region is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Invalid email format";

    // Terms validation
    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the terms and conditions";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image if selected
      if (businessImage) {
        setIsUploading(true);
        const imageUrl = await uploadFile(businessImage, "businesses", (progress) => {
          setUploadProgress(progress);
        });
        setFormData((prev) => ({ ...prev, imageUrl }));
        setIsUploading(false);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Business registered",
        description: "Your business has been registered successfully.",
      });

      router.push("/business/register/success");
    } catch (error) {
      console.error("Error registering business:", error);
      toast({
        title: "Registration failed",
        description: "Failed to register business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    if (activeTab === "basic") {
      // Validate basic information before proceeding
      const basicErrors: Record<string, string> = {};
      if (!formData.businessName.trim()) basicErrors.businessName = "Business name is required";
      if (!formData.businessType) basicErrors.businessType = "Business type is required";
      if (!formData.description.trim()) basicErrors.description = "Description is required";

      if (Object.keys(basicErrors).length > 0) {
        setFormErrors((prev) => ({ ...prev, ...basicErrors }));
        return;
      }

      setActiveTab("contact");
    } else if (activeTab === "contact") {
      // Validate contact information before proceeding
      const contactErrors: Record<string, string> = {};
      if (!formData.region) contactErrors.region = "Region is required";
      if (!formData.city) contactErrors.city = "City is required";
      if (!formData.address.trim()) contactErrors.address = "Address is required";
      if (!formData.phone.trim()) contactErrors.phone = "Phone number is required";
      if (!formData.email.trim()) contactErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) contactErrors.email = "Invalid email format";

      if (Object.keys(contactErrors).length > 0) {
        setFormErrors((prev) => ({ ...prev, ...contactErrors }));
        return;
      }

      setActiveTab("additional");
    }
  };

  const prevTab = () => {
    if (activeTab === "additional") setActiveTab("contact");
    else if (activeTab === "contact") setActiveTab("basic");
  };

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

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                  {/* Basic Information Fields */}
                  {/* ... */}
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

                {/* Contact & Location Tab */}
                <TabsContent value="contact" className="space-y-4">
                  {/* Contact Fields */}
                  {/* ... */}
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

                {/* Additional Details Tab */}
                <TabsContent value="additional" className="space-y-4">
                  {/* Additional Details Fields */}
                  {/* ... */}
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
  );
}