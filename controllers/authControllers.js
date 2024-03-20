import crypto from "node:crypto";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import nodemailer from "nodemailer";

import {User} from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

const register = async (req, res, next) => {
    const {password, email, subscription, token} = req.body;

    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({email: normalizeEmail});

    if (user) throw HttpError(409);

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    await transport.sendMail({
        to: email,
        from: "vsanotskyi@gmail.com",
        subject: "Welcome to BookShelf",
        html: `To confirm you registration please click on the <a href="http://localhost:8080/api/contacts/verify/${verificationToken}">Link</a>`,
        text: `To confirm you registration please open the link http://localhost:8080/api/contacts/verify/${verificationToken}`,
    });

    await User.create({
        password: passwordHash,
        email: normalizeEmail,
        subscription,
        token,
        avatarURL: gravatar.url(normalizeEmail),
        verificationToken,
    });

    res.status(201).send({message: "Create user successful"});
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({email: normalizeEmail});

    if (!user) throw HttpError(401, "Email or password is incorrect");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw HttpError(401, "Email or password is incorrect");

    if (user.verify === false) {
        return res.status(401).send({message: "Your account is not verified"});
    }

    if (user.verify === false) {
        return res.status(401).send({message: "Your account is not veryfied"});
    }

    const token = jwt.sign({
            id: user._id,
        },
        process.env.JWT_SECRET,
        {expiresIn: 60 * 60},
    );

    await User.findByIdAndUpdate(user._id, {token});

    res.send({token});
};

const logout = async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {token: null});

    res.status(204).end();
};

const verify = async (req, res) => {
    const {verificationToken} = req.params;

    const user = await User.findOne({verificationToken});

    if (user === null) {
        return res.status(404).send({message: "Not found"});
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.send({message: "Email confirm successfully"});
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    verify: ctrlWrapper(verify),
};