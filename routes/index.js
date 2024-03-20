import express from "express";

import contactRoutes from "./contactsRouter.js";
import authRouter from "./authRouter.js";
import userRouter from "./usersRouter.js";

import storage from "../middleware/upload.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.use("/contacts", authRouter);
router.use("/contacts", auth, contactRoutes);
router.use("/users", userRouter);

export default router;