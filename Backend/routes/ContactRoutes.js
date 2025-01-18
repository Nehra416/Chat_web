import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { searchContact } from "../controllers/ContactController.js";

const ContactRoutes = express.Router();

ContactRoutes.post("/search", verifyToken, searchContact)

export default ContactRoutes;