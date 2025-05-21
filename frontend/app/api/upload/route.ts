import { NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary-config"

export async function POST(request: Request) {
  try {
    // Check if the request is a multipart form
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Request must be multipart/form-data" }, { status: 400 })
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "businesses/businesses" // Default folder

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`Uploading file ${file.name} (${file.size} bytes) to Cloudinary folder: ${folder}`)

    // Upload to Cloudinary using the new configuration
    const imageUrl = await uploadToCloudinary(file, folder)

    console.log("Cloudinary upload successful:", imageUrl)

    // Return the Cloudinary URL
    return NextResponse.json({
      url: imageUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    )
  }
}

// Increase the body size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
