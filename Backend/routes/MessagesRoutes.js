import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import upload from "../middlewares/Multer.js";

const messageRoutes = express.Router();

messageRoutes.post("/get_messages", verifyToken, getMessages);
messageRoutes.post("/upload_file", verifyToken, upload.single("file"), uploadFile);

export default messageRoutes;

