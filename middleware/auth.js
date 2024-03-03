import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // throw HttpError(401) - помилка, не розумію чому
        res.status(401).send({message: "Invalid token"});
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer") {
        res.status(401).send({message: "Invalid token"});
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            res.status(401).send({message: "Invalid token"});
        }

        const user = await User.findById(decode.id);

        if (!user) {
            res.status(401).send({message: "Invalid token"});
        }

        if (user.token !== token) {
            res.status(401).send({message: "Invalid token"});
        }

        req.user = {
            id: decode.id,
        };

        next();
    });
};

export default auth;