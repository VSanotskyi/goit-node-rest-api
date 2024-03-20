import express from "express";

import contactsControllers from "../controllers/contactsControllers.js";
import {schemas} from "../models/contact.js";
import validateBody from "../helpers/validateBody.js";

const router = express.Router();

router.get("/", contactsControllers.getAllContacts);

router.get("/:id", contactsControllers.getOneContact);

router.delete("/:id", contactsControllers.deleteContact);

router.post("/", validateBody(schemas.createContactSchema), contactsControllers.createContact);

router.put("/:id", contactsControllers.updateContact);

export default router;