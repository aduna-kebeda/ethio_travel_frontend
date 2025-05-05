"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { ClientOnly } from "@/components/client-only"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  label?: string
}

export default function ImageUpload({ value, onChange, disabled, label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, GIF, or WEBP image",
          variant: "destructive",
        })
        return
      }

      try {
        setIsUploading(true)
        setUploadProgress(0)

        // Create a progress simulation
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 95) {
              clearInterval(progressInterval)
              return 95
            }
            return prev + 5
          })
        }, 100)

        // Create form data
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "blog_images")

        // Upload to our API endpoint
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to upload image")
        }

        setUploadProgress(100)
        const data = await response.json()

        // Use the secure URL from Cloudinary
        onChange(data.url)

        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        })
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Failed to upload image",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, toast],
  )

  const handleRemove = useCallback(() => {
    onChange("")
  }, [onChange])

  return (
    <ClientOnly>
      <div className="space-y-4 w-full">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 relative">
          {value ? (
            <div className="relative w-full aspect-video">
              <Image
                src={value || "/placeholder.svg"}
                alt="Uploaded image"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">{label}</p>
              <p className="text-xs text-gray-500 mb-4">JPEG, PNG, GIF or WEBP (max 5MB)</p>
              <Button
                type="button"
                variant="outline"
                disabled={disabled || isUploading}
                className="relative"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  "Select Image"
                )}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={disabled || isUploading}
              />
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
}
