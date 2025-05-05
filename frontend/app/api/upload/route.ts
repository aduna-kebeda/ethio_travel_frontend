import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dpasgcaqm",
  api_key: process.env.CLOUDINARY_API_KEY || "296661259151749",
  api_secret: process.env.CLOUDINARY_API_SECRET || "O39mS4BgA_5bN2miMuaRI3YTfR0",
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique public ID
    const publicId = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    // Upload to Cloudinary with a promise wrapper
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "auto", // Auto-detect resource type
          transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            resolve(result)
          }
        },
      )

      // Handle potential errors during upload
      uploadStream.on("error", (error) => {
        console.error("Stream error during upload:", error)
        reject(error)
      })

      uploadStream.end(buffer)
    })

    if (!result || !result.secure_url) {
      return NextResponse.json({ error: "Failed to upload to Cloudinary" }, { status: 500 })
    }

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred during upload" },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll handle it manually with formData
  },
}
