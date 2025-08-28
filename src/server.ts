import express from "express"
import {CHECK_ID_ROUTES, PORT, PATH_ROUTES, SKIP_ROUTES} from "./config/libConfig.ts";
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from "dotenv";
import {accountRouter} from "./routes/accountRouter.js";
import {authenticate, skipRoutes} from "./middleware/authentication.js";
import {accountServiceMongo} from "./services/AccountServiceImplMongo.js";
import {authorize, checkAccountById} from "./middleware/authorization.js";

export const launchServer = () => {
    //=====load environments======
    dotenv.config();
    // console.log(process.env)
    const app = express();
    app.listen(PORT, () => console.log(`Server runs at http://localhost:${PORT}`));
    const logStream = fs.createWriteStream('logs.txt', {flags: "a"});
    //=========Middleware=============
    app.use(authenticate(accountServiceMongo));
    app.use(skipRoutes(SKIP_ROUTES));
    app.use(authorize(PATH_ROUTES));
    app.use(express.json());
    app.use(checkAccountById(CHECK_ID_ROUTES));
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