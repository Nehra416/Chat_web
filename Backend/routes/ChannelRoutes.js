import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelControler.js";

const channelRoutes = express.Router();

channelRoutes.post("/create_channel", verifyToken, createChannel);
channelRoutes.get("/get_user_channels", verifyToken, getUserChannels);
channelRoutes.get("/get_channel_messages/:channelId", verifyToken, getChannelMessages);

export default channelRoutes;

