import * as path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "temp"));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${file.originalname}`);
    },
});

export default multer({
    storage,
});
