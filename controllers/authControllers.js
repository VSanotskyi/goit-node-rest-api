import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {User} from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const register = async (req, res, next) => {
    const {password, email, subscription, token} = req.body;

    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({email: normalizeEmail});

    if (user) throw HttpError(409);

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({password: passwordHash, email: normalizeEmail, subscription, token});

    res.status(201).send({message: "Create user successful"});
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({email: normalizeEmail});

    if (!user) throw HttpError(401, "Email or password is incorrect");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw HttpError(401, "Email or password is incorrect");

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

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
};