import express, {Response} from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../joiSchemas/bodyValidation.js";
import {ChangeInfoDtoSchema, ChangePassDtoSchema, ReaderDtoSchema} from "../joiSchemas/accountSchema.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const accountRouter = express.Router();

accountRouter.post('/', bodyValidation(ReaderDtoSchema), controller.addAccount);
accountRouter.get('/reader_id', async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.USER ) || req.roles?.includes(Roles.ADMIN ) )
        await controller.getAccountById(req, res);
    throw new HttpError(403, "")
});
accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.USER ) || req.roles?.includes(Roles.ADMIN ) )
        await controller.changePassword(req, res);
    throw new HttpError(403, "")
});
accountRouter.patch('/readerInfo', bodyValidation(ChangeInfoDtoSchema), async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.USER ) || req.roles?.includes(Roles.ADMIN ) )
        await controller.changeUserInfo(req, res);
    throw new HttpError(403, "")
});
accountRouter.delete('/', async (req: AuthRequest, res: Response) => {
    if (req.roles?.includes(Roles.ADMIN))
        await controller.removeAccount(req, res);
    throw new HttpError(403, "")
});