import Message from "../models/MessagesModel.js";
import uploadOnCloudinary2 from "../utils/uploadOnCloudinary2.js";

const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        const page = parseInt(req.query.page) || 1; // Default page is 1st
        const limit = parseInt(req.query.limit) || 15;  // Default 15 messages per page
        const skip = (page - 1) * limit;

        if (!user1 || !user2) {
            return res.status(400).send("Both sender and reciver Id is required");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)


        const totalMessages = await Message.countDocuments({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        });

        const hasMore = skip + limit < totalMessages
        return res.status(200).json({ messages: messages.reverse(), hasMore });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File not found");
        }

        // Check file size from memory buffer
        const fileSizeInMB = req.file.buffer.length / (1024 * 1024);

        if (fileSizeInMB > 5) {
            return res.status(400).send("File too large: Must be less then 5 mb");
        }

        // Upload media on the cloudinary then send the url to the frontend
        const cloudinaryResponse = await uploadOnCloudinary2(req.file.buffer);
        if (!cloudinaryResponse) {
            return res.status(500).send("Error in file upload");
        }

        return res.status(200).json({
            filePath: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.publicId
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export {
    getMessages,
    uploadFile
}