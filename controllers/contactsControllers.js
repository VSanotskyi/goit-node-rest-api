import {Contact} from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
    const contacts = await Contact.find({owner: req.user.id});
    res.json(contacts);
};

const getOneContact = async (req, res) => {
    const {id} = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
        throw HttpError(404);
    }

    if (contact.owner.toString() !== req.user.id) {
        throw HttpError(404);
    }

    res.json(contact);
};

const deleteContact = async (req, res) => {
    const {id} = req.params;

    const contact = await Contact.findById(id);

    if (contact.owner.toString() !== req.user.id) {
        throw HttpError(404);
    }

    const delContact = await Contact.findByIdAndDelete(id);

    if (!delContact) throw HttpError(404);

    res.json({message: "Delete success"});
};

const createContact = async (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite,
        owner: req.user.id,
    };

    const result = await Contact.create(contact);

    res.json(result);
};

const updateContact = async (req, res) => {
    const {id} = req.params;

    const contact = await Contact.findById(id);

    if (contact.owner.toString() !== req.user.id) {
        throw HttpError(404);
    }

    const updateContact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

    if (!updateContact) throw HttpError(404);

    res.json(updateContact);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
};