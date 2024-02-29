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
});

const authUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
});

const schemas = {
    authUserSchema,
};

const User = mongoose.model("User", userSchema);

export {
    User,
    schemas,
};