import contactsServices from "../services/contactsServices.js";
import {ctrlWrappers, HttpError} from "../helpers/index.js";

const getAll = async (_, res) => {
    const result = await contactsServices.getAllContacts();
    res.json(result);
};

const getById = async (req, res) => {
    const {id} = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) throw HttpError(404);
    res.json(result);
};

const add = async (req, res) => {
    const result = await contactsServices.addContact(req.body);
    res.status(201).json(result);
};

const del = async (req, res) => {
    const {id} = req.params;
    const result = await contactsServices.delContactById(id);
    if (!result) throw HttpError(404);
    res.json(result);
};

const update = async (req, res) => {
    const {id} = req.params;
    const result = await contactsServices.updateContactById(id, req.body);
    if (!result) throw HttpError(404);
    res.json(result);
};

export default {
    getAll: ctrlWrappers(getAll),
    getById: ctrlWrappers(getById),
    add: ctrlWrappers(add),
    del: ctrlWrappers(del),
    update: ctrlWrappers(update),
};