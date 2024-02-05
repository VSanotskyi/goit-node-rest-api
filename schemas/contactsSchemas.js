import Joi from "joi";

export const createContactSchemas = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
});

export const updateContactSchemas = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
}).min(1).message("Body must have at least one field");
