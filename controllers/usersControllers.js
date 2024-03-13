import * as fs from "node:fs/promises";
import * as path from "node:path";

import Jimp from "jimp";

import {User} from "../models/user.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const dirName = process.cwd();

const upload = async (req, res) => {
    const {id} = req.user;

    if (!req.file) {
        return res.status(400).send({message: "No file upload"});
    }

    const {path: oldPath, filename} = req.file;

    Jimp.read(oldPath, async (err, image) => {
        if (err) throw err;

        const newPath = path.join(dirName, "public", "avatars", filename);

        image
            .resize(250, 250)
            .write(newPath);
    });

    // await fs.rename(oldPath, path.join(dirName, "public", "avatars", filename));

    const user = await User.findByIdAndUpdate(
        id,
        {avatarURL: filename},
        {new: true},
    );

    await fs.rm(oldPath);

    res.send(user);
};

const getAvatar = async (req, res) => {
    const {id} = req.user;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).send({message: "Not found"});
    }

    // res.sendfile(path.join(dirName, "public", "avatars", user.avatarURL));
    res.send({avatarURL: user.avatarURL});
};

export default {
    upload: ctrlWrapper(upload),
    getAvatar: ctrlWrapper(getAvatar),
};