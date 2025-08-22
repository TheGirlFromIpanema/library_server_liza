import express from "express"
import {PORT} from "./config/libConfig.js";
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from "dotenv";
import {accountRouter} from "./routes/accountRouter.js";

export const launchServer = () => {
    //=====load environments======
    dotenv.config();
    // console.log(process.env)
    const app = express();
    app.listen(process.env.PORT, () => console.log(`Server runs at http://localhost:${process.env.PORT}`));
    const logStream = fs.createWriteStream('logs.txt', {flags: "a"});
    //=========Middleware=============
    app.use(express.json());
    app.use(morgan("dev"));
    app.use(morgan('combined', {stream: logStream}));

    //=============Router=============
    app.use('/accounts', accountRouter)
    app.use('/api', libRouter);

    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

    //=====ErrorHandler==========

    app.use(errorHandler)
}