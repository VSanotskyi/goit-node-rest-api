import express from "express";

import {schemas} from "../models/user.js";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";

const router = express.Router();

router.post("/register", validateBody(schemas.authUserSchema), authControllers.register);
router.post("/login", validateBody(schemas.authUserSchema), authControllers.login);

export default router;