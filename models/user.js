import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["started", "pro", "business"],
        default: "started",
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, "Verify token is required"],
    },
});

const authUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
    avatarURL: Joi.string(),
});

const verifyUserSchema = Joi.object({
    email: Joi.string().email(), // .required(),
});

const schemas = {
    authUserSchema,
    verifyUserSchema,
};

const User = mongoose.model("User", userSchema);

export {
    User,
    schemas,
};