import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getMessages } from "../controllers/MessagesController.js";

const messageRoutes = express.Router();

messageRoutes.post("/get_messages", verifyToken, getMessages);

export default messageRoutes;

