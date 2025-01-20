import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getContactForDm, searchContact } from "../controllers/ContactController.js";

const ContactRoutes = express.Router();

ContactRoutes.post("/search", verifyToken, searchContact)
ContactRoutes.get("/get_contact_for_dm", verifyToken, getContactForDm)

export default ContactRoutes;