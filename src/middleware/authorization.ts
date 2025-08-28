/*
PATCH/accounts/password => Roles.USER,
GET/accounts/reader_id => ROLES.USER, ROLES.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {NextFunction} from "express";
import {HttpError} from "../errorHandler/HttpError.js";


export const authorize = (pathRoute:Record<string, Roles[]>)=>
    (req:AuthRequest, res:Response, next:NextFunction)=> {
        const route = req.method + req.path
        const roles = req.roles;
        if(!roles || roles?.some(r => pathRoute[route].includes(r)))
            next();
        else throw new HttpError(403, "authorize block")
    }

export  const checkAccountById = (checkPathId:string[]) => {
    return (req:AuthRequest, res:Response, next:NextFunction)=> {
        const route = req.method + req.path;
        const roles = req.roles;
        if(!roles || !checkPathId.includes(route) || req.roles!.includes(Roles.ADMIN) ||
            (req.roles!.includes(Roles.USER)
            && (req.body? req.userId == req.body.id : req.userId == req.query.id)))
            next();
        else throw new HttpError(403, "You can modify only your own account")
    }
}