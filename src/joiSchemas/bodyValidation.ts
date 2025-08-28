import {ObjectSchema} from 'joi'
import {Response, Request,NextFunction} from "express";
import {HttpError} from "../errorHandler/HttpError.js";
import {ArraySchema} from "./accountSchema.js";


export const bodyValidation = (schema:ObjectSchema|ArraySchema) =>
    (req:Request, res:Response, next:NextFunction) => {

        if(!req.body) throw new HttpError(400, "Body required")
        const {error} = schema.validate(req.body)
        if(error) throw new HttpError(400, error.message)
        next();
    }