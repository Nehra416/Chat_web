import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactForDm, searchContact } from "../controllers/ContactController.js";

const ContactRoutes = express.Router();

ContactRoutes.post("/search", verifyToken, searchContact)
ContactRoutes.get("/get_contact_for_dm", verifyToken, getContactForDm)
ContactRoutes.get("/get_all_contacts", verifyToken, getAllContacts)

export default ContactRoutes;