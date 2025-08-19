import { v2 as cloudinary } from 'cloudinary';
import { fileTypeFromBuffer } from 'file-type';  
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 100000,
});

export const uploadToCloudinary = async (buffer, folder, originalname = 'file') => {
  try {
    let detectedExt = '';
    const fileType = await fileTypeFromBuffer(buffer);
    if (fileType?.ext) {
      detectedExt = fileType.ext; // e.g. "pdf", "docx"
    }

    const fileExtension = originalname.includes('.') 
      ? originalname.split('.').pop().toLowerCase()
      : detectedExt;

    const fileName = originalname.includes('.') 
      ? originalname.split('.')[0] 
      : 'upload';

    const publicId = fileExtension
      ? `${fileName}-${Date.now()}.${fileExtension}`
      : `${fileName}-${Date.now()}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          format: fileExtension || undefined,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  } catch (err) {
    throw err;
  }
};
