import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpasgcaqm',
  api_key: '296661259151749',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads an image to Cloudinary
 * @param file The file to upload
 * @param folder The folder in Cloudinary to upload to
 * @returns Promise with the upload result
 */
export const uploadToCloudinary = async (file: File, folder = 'businesses'): Promise<string> => {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const base64File = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Deletes an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export default cloudinary; 