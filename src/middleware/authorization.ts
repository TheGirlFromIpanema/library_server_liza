/*
PATCH/accounts/password => Roles.USER,
GET/accounts/reader_id => ROLES.USER, ROLES.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {NextFunction} from "express";
import {HttpError} from "../errorHandler/HttpError.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {configuration} from "../config/libConfig.js";


export const authorize = (pathRoute: Record<string, Roles[]>) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path
        const roles = req.roles;
        if (!roles || roles?.some(r => pathRoute[route].includes(r)))
            next();
        else throw new HttpError(403, "authorize block")
    }

export const checkAccountById = (checkPathId: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path;
        const roles = req.roles;
        if (!roles || !checkPathId.includes(route) || req.roles!.includes(Roles.ADMIN) ||
            ((req.roles!.includes(Roles.USER) || req.roles!.includes(Roles.PREMIUM_USER))
                && (req.body ? req.userId == req.body.id : req.userId == req.query.id)))
            next();
        else throw new HttpError(403, "You can modify only your own account")
    }
}

export const requestTimeLimit = () => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const roles = req.roles;
        const userId = req.userId;
        if (!roles || req.roles!.length > 1 || !req.roles!.includes(Roles.USER))
            return next();

        const user = await ReaderModel.findById(userId);
        if (!user) throw new HttpError(401, "User not found");

        const now = Date.now();
        const timePassed = (now - (user.lastRequestTime || 0)) / 1000;
        if (timePassed > 60) {
            await ReaderModel.findByIdAndUpdate(userId, {
                $set: {requestsCount: 1, lastRequestTime: now}
            });
            return next();
        }
        if (user.requestsCount >= configuration.reqLimit) {
            throw new HttpError(403, "Too many requests for role User");
        }
        await ReaderModel.findByIdAndUpdate(userId, {
            $inc: {requestsCount: 1}
        });

        next();
    }
}