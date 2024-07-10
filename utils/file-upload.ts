import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const handleFileUpload = async (
  imageUrl: string
): Promise<UploadApiResponse | null> => {
  try {
    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
      imageUrl,
      {
        folder: "runo",
      }
    );
    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};
