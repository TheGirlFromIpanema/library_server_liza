import {Response, Request} from "express";
import {Reader, ReaderDto} from "../model/Reader.js";
import {convertReaderDtoToReader} from "../utils/tools.js";
import {accountServiceMongo} from "../services/AccountServiceImplMongo.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";


export const removeAccount = async (req: Request, res: Response) => {
    const {id} = req.query;
    const _id = checkReaderId(id as string);
    const account = await accountServiceMongo.removeAccount(_id);
    res.json(account)
}

export const changePassword = async (req: Request, res: Response) => {
    const {id, oldPassword, newPassword} = req.body;

    const _id = checkReaderId(id);
    await accountServiceMongo.changePassword(_id, oldPassword, newPassword);
    res.send("Password changed")
}


export const getAccountById =async (req: Request, res: Response) => {
    const {id} = req.query;
    const _id = checkReaderId(id as string);
    const account = await accountServiceMongo.getAccountById(_id);
    res.json(account);
}
export const addAccount = async (req: Request, res: Response) => {
    const body = req.body;
    const reader: Reader = convertReaderDtoToReader(body as ReaderDto);
    await accountServiceMongo.addAccount(reader);
    res.status(201).send();
}

const checkReaderId = (id: string | undefined) => {
    if (!id) throw new HttpError(400, "No ID in request");
    const _id = parseInt(id as string);
    if (!_id) throw new HttpError(400, "ID must be a number");
    return _id;
}