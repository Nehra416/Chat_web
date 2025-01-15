import express from "express";
import { deleteProfileImage, getUserInfo, login, logout, profileImage, profileUpdate, signup } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/Multer.js"

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, profileUpdate);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profileImage"), profileImage);
authRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage);
authRoutes.get("/logout", logout);


export default authRoutes;