import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return res.status(400).send("Both sender and reciver Id is required");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 })

        return res.status(200).json({ messages });

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

        const filePath = req.file.path;

        return res.status(200).json({ filePath });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export {
    getMessages,
    uploadFile
}