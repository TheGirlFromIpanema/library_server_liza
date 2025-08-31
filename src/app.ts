import {launchServer} from "./server.ts";
import * as mongoose from "mongoose";
import {configuration} from "./config/libConfig.js";

mongoose.connect(configuration.mongoUri)
    .then(() => {
        console.log("MongoDB successfully connected")
        launchServer();
    })
    .catch((e) => {
        console.error(e);
        console.log("Something went wrong")
    })