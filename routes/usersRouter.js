import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import storage from "../middleware/upload.js";
import validateBody from "../helpers/validateBody.js";
import {schemas} from "../models/user.js";
import auth from "../middleware/auth.js";

const route = express.Router();

route.patch("/avatar", auth, storage.single("avatar"), usersControllers.upload);
route.get("/avatar", auth, usersControllers.getAvatar);
route.post("/verify", validateBody(schemas.verifyUserSchema), usersControllers.verify);

export default route;