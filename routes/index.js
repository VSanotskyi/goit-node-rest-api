import express from "express";

import contactRoutes from "./contactsRouter.js";
import authRouter from "./authRouter.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.use("/contacts", authRouter);
router.use("/contacts", auth, contactRoutes);

export default router;