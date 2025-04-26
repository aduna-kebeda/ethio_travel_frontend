"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { X, Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { uploadFile } from "@/lib/upload-file"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ChoosePhotoPage() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        })
        return
      }

      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleRemovePhoto = () => {
    setPhoto(null)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSkip = () => {
    // Handle skip logic and redirect to next step
    router.push("/signup/success")
  }

  const handleNext = async () => {
    if (!file && !photo) {
      handleSkip()
      return
    }

    try {
      setUploading(true)

      if (file) {
        // Upload to Firebase Storage
        const photoUrl = await uploadFile(file, "profiles", (progress) => {
          setUploadProgress(progress)
        })

        // Here you would typically save the photoUrl to the user's profile in your database
        console.log({ photoUrl })

        toast({
          title: "Profile photo uploaded",
          description: "Your profile photo has been uploaded successfully.",
        })
      }

      // Navigate to next step
      router.push("/signup/success")
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <AuthLayout imagePosition="left">
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <Logo />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Choose Photo for profile</h2>
          <p className="mt-2 text-sm text-gray-600">Photo can be changed anytime in the profile setting.</p>
        </div>

        <div className="mb-8">
          {photo ? (
            <div className="relative w-40 h-40 mx-auto">
              <img src={photo || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover rounded-md" />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>

              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-xs">{Math.round(uploadProgress)}%</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="w-40 h-40 mx-auto border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-primary"
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">Click to upload</p>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" className="w-full" onClick={handleSkip} disabled={uploading}>
            Skip
          </Button>
          <Button type="button" className="w-full" onClick={handleNext} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
