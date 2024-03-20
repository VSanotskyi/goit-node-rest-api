import mongoose from "mongoose";

const URI = process.env.URI;

mongoose.connect(URI)
    .then(() => {
        console.log("Database connect successful");
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

