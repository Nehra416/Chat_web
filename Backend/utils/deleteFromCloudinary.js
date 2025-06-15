import cloudinary from "../config/CloudinaryConfig.js";

const deleteFromCloudinary = async (publicId, isVideo = false) => {
    try {
        // If publicId is not provided then return
        if (!publicId) {
            console.log("No publicId found for delete file.");
            return;
        }

        // Set resource_type to "video" for videos
        const options = isVideo ? { resource_type: "video" } : {};

        // delete the file from cloudinary server
        const res = await cloudinary.uploader.destroy(publicId, options);

        // Check that file is deleted or not form cloudinary server
        if (res.result !== "ok") {
            console.log(`Failed to delete file with public_id: ${publicId}, \n Response is: `, res);
        }

    } catch (error) {
        console.log("Error in deleteFronCloudinary", error)
    }
}

export default deleteFromCloudinary;