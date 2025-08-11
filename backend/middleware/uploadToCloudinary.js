//cloudinary upload
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 100000,
});
{/*console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); */}

export const uploadToCloudinary = (buffer, folder, originalname = 'file') => {
  return new Promise((resolve, reject) => {
    try {
      const fileExtension = originalname.includes('.') ? originalname.split('.').pop() : '';
      const fileName = originalname.includes('.') ? originalname.split('.')[0] : 'upload';
      const publicId = `${fileName}-${Date.now()}`; 

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,                     
          public_id: publicId,         
          resource_type: 'auto',
          use_filename: true,
          unique_filename: false,
          overwrite: true, 
          type: 'upload', 
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    } catch (err) {
      reject(err);
    }
  });
};
