import {launchServer} from "./server.ts";
import * as mongoose from "mongoose";
import {MONGO_URI} from "./config/libConfig.js";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB successfully connected")
        launchServer();
    })
    .catch((e) => {
        console.error(e);
        console.log("Something went wrong")
    })