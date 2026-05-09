import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder to upload into (e.g. 'profile_pictures')
 * @param {string} [resourceType='auto'] - Cloudinary resource type ('image', 'raw', 'auto')
 * @returns {Promise<object>} Cloudinary upload result (includes .secure_url)
 */
export const uploadToCloudinary = (buffer, folder, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        // Convert buffer to readable stream and pipe into Cloudinary
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
};

export default cloudinary;