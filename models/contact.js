import mongoose, {Schema} from "mongoose";
import Joi from "joi";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Set name for contact"],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
});

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.bool(),
    owner: Joi.string(),
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