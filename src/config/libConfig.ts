import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

export const PORT = 3900;
export const MONGO_URI = 'mongodb+srv://liza:UZRrO03RYC0quIb3@clusterlibrary.btfgyhx.mongodb.net/library?retryWrites=true&w=majority&appName=ClusterLibrary'

dotenv.config();
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})
// const connection = await pool.getConnection();