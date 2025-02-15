import { v2 as _cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary environment variables');
}

_cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinary = _cloudinary.uploader;

type Metadata = { projectId: string; id: string };

export const uploadMediaFiles = async (
  mediaFiles: string[] = [],
  { projectId, id }: Metadata
): Promise<string[]> => {
  if (!mediaFiles.length || !Array.isArray(mediaFiles)) return [];
  const mediaUrls = [];
  try {
    for await (const [index, base64] of mediaFiles.entries()) {
      const res = await cloudinary.upload(base64, {
        public_id: `${projectId}-${id}-${index}`,
        overwrite: true,
        quality: "auto",
      });
      mediaUrls.push(res.secure_url);
    }
  } catch (error) {
    throw new Error(`Media file Upload Error: ${JSON.stringify(error)}`);
  }
  return mediaUrls;
}; 