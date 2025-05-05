import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: "dpasgcaqm",
  api_key: "296661259151749",
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Uploads an image to Cloudinary
 * @param file The file to upload (as a base64 string or file path)
 * @param folder The folder in Cloudinary to upload to
 * @returns Promise with the upload result
 */
export const uploadToCloudinary = async (file: string, folder = "travel_app"): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
    })

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error("Failed to upload image to Cloudinary")
  }
}

/**
 * Generates a Cloudinary URL with transformations
 * @param publicId The public ID of the image
 * @param options Transformation options
 * @returns The transformed image URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: number
    format?: string
  } = {},
): string => {
  if (!publicId) return ""

  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options

  // Create transformation string
  let transformations = `q_${quality},f_${format}`

  if (width) transformations += `,w_${width}`
  if (height) transformations += `,h_${height}`
  if (width || height) transformations += `,c_${crop}`

  // Handle full URLs vs just public IDs
  let cleanPublicId = publicId
  if (publicId.includes("upload/")) {
    cleanPublicId = publicId.split("upload/")[1]
    if (cleanPublicId.includes("/")) {
      cleanPublicId = cleanPublicId.split("/").slice(1).join("/")
    }
  }

  return `https://res.cloudinary.com/dpasgcaqm/image/upload/${transformations}/${cleanPublicId}`
}

/**
 * Deletes an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    return await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw new Error("Failed to delete image from Cloudinary")
  }
}

export default cloudinary
