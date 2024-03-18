import * as fs from "node:fs/promises";
import * as path from "node:path";

import Jimp from "jimp";

import {User} from "../models/user.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import nodemailer from "nodemailer";

const dirName = process.cwd();

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

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

const verify = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).send({message: "missing required field email"});
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(404).send({message: "Not found"});
    }

    if (user.verify === true) {
        return res.status(400).send({message: "Verification has already been passed"});
    }


    const verificationToken = user.verificationToken;

    await transport.sendMail({
        to: email,
        from: "vsanotskyi@gmail.com",
        subject: "Welcome to BookShelf",
        html: `To confirm you registration please click on the <a href="http://localhost:8080/api/contacts/verify/${verificationToken}">Link</a>`,
        text: `To confirm you registration please open the link http://localhost:8080/api/contacts/verify/${verificationToken}`,
    });

    res.send({message: "send new verificationToken"});
};

export default {
    upload: ctrlWrapper(upload),
    getAvatar: ctrlWrapper(getAvatar),
    verify: ctrlWrapper(verify),
};