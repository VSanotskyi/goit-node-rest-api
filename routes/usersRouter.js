import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import storage from "../middleware/upload.js";

const route = express.Router();

route.patch("/avatar", storage.single("avatar"), usersControllers.upload);
route.get("/avatar", usersControllers.getAvatar);

export default route;