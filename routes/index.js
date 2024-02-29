import express from "express";

import contactRoutes from "./contactsRouter.js";
import authRouter from "./authRouter.js";

const router = express.Router();

router.use("/contacts", authRouter);
router.use("/contacts", contactRoutes);

export default router;