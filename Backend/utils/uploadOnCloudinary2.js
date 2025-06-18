import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const uploadOnCloudinary2 = async (buffer, folder = "QuickTalk") => {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder,
                    quality: "auto:low"
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            streamifier.createReadStream(buffer).pipe(uploadStream);
        });

        // Return the response
        return {
            secure_url: result.secure_url,
            duration: result.duration,
            publicId: result.public_id
        };

    } catch (error) {
        console.log("Error in uploadOnCloudinary2:", error);
        return null;
    }
};

export default uploadOnCloudinary2;