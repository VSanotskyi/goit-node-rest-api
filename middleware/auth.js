import jwt from "jsonwebtoken";

import {User} from "../models/user.js";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // throw HttpError(401) - помилка, не розумію чому
        return res.status(401).send({message: "Invalid token"});
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer") {
        return res.status(401).send({message: "Invalid token"});
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            return res.status(401).send({message: "Invalid token"});
        }

        const user = await User.findById(decode.id);

        if (!user) {
            return res.status(401).send({message: "Invalid token"});
        }

        if (user.token !== token) {
            return res.status(401).send({message: "Invalid token"});
        }

        req.user = {
            id: decode.id,
        };

        next();
    });
};

export default auth;