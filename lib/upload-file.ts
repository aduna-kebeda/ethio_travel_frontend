import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"
import { v4 as uuidv4 } from "uuid"

type ProgressCallback = (progress: number) => void

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage to upload to (e.g., 'users', 'blogs', 'events')
 * @param onProgress Optional callback for upload progress
 * @returns Promise with the download URL
 */
export const uploadFile = async (file: File, path: string, onProgress?: ProgressCallback): Promise<string> => {
  // Create a unique filename to prevent overwriting
  const fileExtension = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExtension}`
  const storageRef = ref(storage, `${path}/${fileName}`)

  // Create upload task
  const uploadTask = uploadBytesResumable(storageRef, file)

  // Return a promise that resolves with the download URL
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and report progress if callback provided
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
          onProgress(progress)
        }
      },
      (error) => {
        // Handle errors
        console.error("Upload failed:", error)
        reject(error)
      },
      async () => {
        // Upload completed successfully, get download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      },
    )
  })
}

/**
 * Validates if a file is an image and within size limits
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Object with validation result and error message if any
 */
export const validateImageFile = (file: File, maxSizeMB = 5): { valid: boolean; error?: string } => {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" }
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
