import cloudinary from "../config/CloudinaryConfig.js";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No local file path provided for upload on cloudinary");
            return;
        }

        // file upload on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "QuickTalk",
            quality: "auto:low"
        })
        // console.log("cloudinary response", res);

        // Check that local file is exist or not in our server, if exist then remove it
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        // return obj with secure_url and duration of uploaded file
        const response = {
            secure_url: res?.secure_url,
            duration: res?.duration,
            publicId: res?.public_id
        }
        return response;

    } catch (error) {
        console.log("Error in uploadOnCloudinary", error)
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // remove the user file which is stored in our server
        }
        return null;
    }
}

export default uploadOnCloudinary;
