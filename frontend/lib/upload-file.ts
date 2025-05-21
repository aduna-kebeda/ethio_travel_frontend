import { v4 as uuidv4 } from "uuid"

type ProgressCallback = (progress: number) => void

// Improve the compressImage function to handle errors better
export const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Skip compression for non-image files or SVGs
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      console.log("Skipping compression for non-image or SVG file:", file.name)
      resolve(file)
      return
    }

    console.log(`Starting image compression for ${file.name}, size: ${file.size} bytes`)

    try {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const img = new Image()

          img.onload = () => {
            try {
              // Calculate new dimensions
              let width = img.width
              let height = img.height

              console.log(`Original dimensions: ${width}x${height}`)

              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width)
                width = maxWidth
                console.log(`Resizing to: ${width}x${height}`)
              } else {
                console.log("No resizing needed, image is within max width")
              }

              // Create canvas and draw image
              const canvas = document.createElement("canvas")
              canvas.width = width
              canvas.height = height

              const ctx = canvas.getContext("2d")
              if (!ctx) {
                console.warn("Could not get canvas context, returning original file")
                resolve(file) // Fallback to original if canvas context fails
                return
              }

              ctx.drawImage(img, 0, 0, width, height)

              // Convert to blob
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    console.warn("Blob creation failed, returning original file")
                    resolve(file) // Fallback to original if blob creation fails
                    return
                  }

                  // Create new file from blob
                  const newFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  })

                  console.log(
                    `Compression complete: ${file.size} → ${newFile.size} bytes (${Math.round((newFile.size / file.size) * 100)}%)`,
                  )
                  resolve(newFile)
                },
                file.type,
                quality,
              )
            } catch (canvasError) {
              console.error("Error during canvas operations:", canvasError)
              resolve(file) // Fallback to original
            }
          }

          img.onerror = (imgError) => {
            console.error("Error loading image:", imgError)
            resolve(file) // Fallback to original if image loading fails
          }

          img.src = event.target?.result as string
        } catch (imgError) {
          console.error("Error creating image:", imgError)
          resolve(file) // Fallback to original
        }
      }

      reader.onerror = (readerError) => {
        console.error("Error reading file:", readerError)
        resolve(file) // Fallback to original if file reading fails
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Unexpected error during compression:", error)
      resolve(file) // Fallback to original
    }
  })
}

// Add a direct Cloudinary upload function as a fallback
export const directCloudinaryUpload = async (file: File, folder = "businesses"): Promise<string> => {
  try {
    console.log(`Starting direct Cloudinary upload for ${file.name}, size: ${file.size} bytes`)

    // Create form data
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", folder)
    formData.append("cloud_name", "dpasgcaqm")

    // Upload directly to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/dpasgcaqm/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Direct Cloudinary upload failed with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Direct Cloudinary upload successful:", data.secure_url)
    return data.secure_url
  } catch (error) {
    console.error("Direct Cloudinary upload error:", error)
    throw new Error("Failed to upload image directly to Cloudinary")
  }
}

// Update the uploadFile function to use direct Cloudinary upload as a fallback
export const uploadFile = async (file: File, path: string, onProgress?: ProgressCallback): Promise<string> => {
  try {
    // Validate the file before uploading
    const validation = validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error || "Invalid file")
    }

    // Compress the image before uploading (if it's an image)
    const compressedFile = await compressImage(file)

    // First try the API route
    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", compressedFile)
      formData.append("folder", path)

      // Use XMLHttpRequest for better progress tracking
      const apiRouteUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open("POST", "/api/upload", true)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response.url)
            } catch (error) {
              reject(new Error("Invalid response from server"))
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`))
          }
        }

        xhr.onerror = () => {
          reject(new Error("Network error during upload"))
        }

        xhr.send(formData)
      })

      return apiRouteUrl
    } catch (apiRouteError) {
      console.error("API route upload failed, trying direct Cloudinary upload:", apiRouteError)

      // Fall back to direct Cloudinary upload
      if (onProgress) onProgress(30) // Reset progress for new upload attempt

      return await directCloudinaryUpload(compressedFile, path)
    }
  } catch (error) {
    console.error("Error in uploadFile:", error)
    throw error
  }
}

/**
 * Validates if a file is an image and within size limits
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Object with validation result and error message if any
 */
export const validateImageFile = (file: File, maxSizeMB = 5): { valid: boolean; error?: string } => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: "No file provided" }
  }

  // Check if file is an image
  const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
  if (!validImageTypes.includes(file.type)) {
    return {
      valid: false,
      error: "File must be a valid image (JPEG, PNG, GIF, WEBP, or SVG)",
    }
  }

  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeMB}MB`,
    }
  }

  return { valid: true }
}

/**
 * Uploads multiple files to Cloudinary
 * @param files Array of files to upload
 * @param path The folder in Cloudinary to upload to
 * @param onProgress Optional callback for overall upload progress
 * @returns Promise with array of download URLs
 */
export const uploadMultipleFiles = async (
  files: File[],
  path: string,
  onProgress?: ProgressCallback,
): Promise<string[]> => {
  try {
    if (!files.length) return []

    // Upload files sequentially to avoid overwhelming the server
    const urls: string[] = []
    let totalProgress = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Upload each file with its own progress tracking
      const url = await uploadFile(file, path, (progress) => {
        if (onProgress) {
          // Calculate overall progress
          const fileWeight = 1 / files.length
          const fileContribution = progress * fileWeight
          const previousFilesContribution = i * fileWeight * 100

          totalProgress = previousFilesContribution + fileContribution
          onProgress(Math.round(totalProgress))
        }
      })

      urls.push(url)
    }

    return urls
  } catch (error) {
    console.error("Error in uploadMultipleFiles:", error)
    throw error
  }
}

/**
 * Generates a unique filename for uploads
 * @param originalFilename The original filename
 * @returns A unique filename with the original extension
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const fileExtension = originalFilename.split(".").pop() || "jpg"
  return `${uuidv4()}.${fileExtension}`
}
