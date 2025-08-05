import express from "express"
import {PORT} from "./config/libConfig.js";
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";

export const launchServer = () => {
    const app = express();
    app.listen(PORT, () => console.log(`Server runs at http://localhost:${PORT}`));

    //=========Middleware=============
    app.use(express.json());


    //=============Router=============

    app.use('/api', libRouter);

    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

    //=====ErrorHandler==========

    app.use(errorHandler)
}