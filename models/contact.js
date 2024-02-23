import mongoose from "mongoose";
import Joi from "joi";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.bool(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.bool(),
}).min(1).message("Body must have at least one field");


const schemas = {
    createContactSchema,
    updateContactSchema,
};

const Contact = mongoose.model("Contact", contactSchema);

export {
    Contact,
    schemas,
};