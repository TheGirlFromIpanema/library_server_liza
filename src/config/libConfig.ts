import mysql, {Pool} from 'mysql2/promise'
import dotenv from 'dotenv'
import {Roles} from "../utils/libTypes.js";
import appConf from "../../app-config/app-config.json";

export interface AppConfig {
    port:number,
    skipRoutes:string[],
    pathRoles: Record<string, string[]>,
    checkIdRoutes:string[],
    pool: Pool,
    mongoUri:string,
    jwt:{
        secret:string,
        exp:string|number
    }

}

// export const PORT = 3900;
// export const MONGO_URI = 'mongodb+srv://liza:UZRrO03RYC0quIb3@clusterlibrary.btfgyhx.mongodb.net/library?retryWrites=true&w=majority&appName=ClusterLibrary'

dotenv.config();

export const configuration:AppConfig = {
    ...appConf,
    pool: mysql.createPool({
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }),
    mongoUri: process.env.MONGO_URI || "dev db address",
    jwt:{
        secret: process.env.JWT_SECRET || "super-secret",
        exp: process.env.JWT_EXP || "1h"
    }
}


// export const SKIP_ROUTES = [
//     "POST/accounts", "GET/api/books", "GET/api/books/genres", "GET/api/books/gen_st", "GET/api/books/booksByUser"
// ]
//
// export const PATH_ROUTES = {
//     "GET/accounts/reader_id": [Roles.USER, Roles.ADMIN],
//     "PATCH/accounts/password": [Roles.USER],
//     "DELETE/accounts": [Roles.SUPERVISOR],
//     "PATCH/accounts/readerInfo": [Roles.USER, Roles.ADMIN],
//     "PUT/accounts/roles": [Roles.SUPERVISOR],
//     "POST/api/books": [Roles.LIBRARIAN, Roles.ADMIN],
//     "PUT/api/books/pickUp": [Roles.LIBRARIAN],
//     "PUT/api/books/return": [Roles.USER, Roles.LIBRARIAN, Roles.ADMIN],
//     "DELETE/api/books": [Roles.ADMIN, Roles.LIBRARIAN],
// }
//
// export const CHECK_ID_ROUTES = [
//     "GET/accounts/reader_id", "PATCH/accounts/password", "PATCH/accounts/readerInfo"
// ]