import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import DbConnection from "./config/DbConnection.js";
import authRoutes from "./routes/AuthRoutes.js";
import ContactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket io/socket.js";
import messageRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

// Load environment variables from.env file
dotenv.config();

const app = express();

// Define the port number of the server
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
DbConnection();

// Middleware to parse JSON request
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}))

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use("/api/auth", authRoutes);
app.use("/api/contact", ContactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);


// Start the server
const server = app.listen(PORT, () => {
    console.log('Server is listening on port : ', PORT);
});

setupSocket(server);