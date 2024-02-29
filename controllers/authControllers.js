import bcrypt from "bcrypt";

import {User} from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const register = async (req, res, next) => {
    const {password, email, subscription, token} = req.body;

    const normalizeEmail = email.toLowerCase();

    try {
        const user = await User.findOne({email: normalizeEmail});

        if (user) throw HttpError(409);

        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({password: passwordHash, email: normalizeEmail, subscription, token});

        res.status(201).send({message: "Create user successful"});
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const normalizeEmail = email.toLowerCase();

        const user = await User.findOne({email: normalizeEmail});

        if (!user) throw HttpError(401, "Email or password is incorrect");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw HttpError(401, "Email or password is incorrect");

        res.end("Succesfull");
    } catch (error) {
        next(error);
    }
};


export default {
    register,
    login,
};