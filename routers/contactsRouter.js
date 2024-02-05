import express from "express";

import ctrl from "../controllers/contactsControllers.js";
import {validateBody} from "../helpers/index.js";
import {
    createContactSchemas,
    updateContactSchemas,
} from "../schemas/contactsSchemas.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAll);

contactsRouter.get("/:id", ctrl.getById);

contactsRouter.post("/", validateBody(createContactSchemas), ctrl.add);

contactsRouter.delete("/:id", ctrl.del);

contactsRouter.put("/:id", validateBody(updateContactSchemas), ctrl.update);