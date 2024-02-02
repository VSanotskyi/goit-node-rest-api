import fs from "fs/promises";
import path from "path";
import {nanoid} from "nanoid";

const contactsPath = path.join(__dirname, "../db/contacts.json");

const listContacts = async () => {
    const buffer = await fs.readFile(contactsPath);
    return JSON.parse(buffer);
};

const getContactById = async (contactId) => {
    const id = String(contactId);
    const contacts = await listContacts();
    const index = contacts.findIndex(el => el.id === id);

    if (index === -1) return null;

    return contacts[index];
};

const removeContact = async (contactId) => {
    const id = String(contactId);
    const contacts = await listContacts();
    const index = contacts.findIndex(el => el.id === id);

    if (index === -1) return null;

    const [rmContact] = contacts.splice(index, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return rmContact;
};

const addContact = async (data) => {
    const newContact = {
        id: nanoid(),
        ...data,
    };
    const contacts = await listContacts();

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
};

exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};