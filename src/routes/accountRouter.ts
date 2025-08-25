import express, {Response} from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../joiSchemas/bodyValidation.js";
import {ChangePassDtoSchema, ReaderDtoSchema} from "../joiSchemas/accountSchema.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";


export const  accountRouter = express.Router();

accountRouter.post('/',bodyValidation(ReaderDtoSchema),controller.addAccount);
accountRouter.get('/reader_id', async (req: AuthRequest, res: Response) => {
    if(req.roles?.includes(Roles.USER))
        await controller.getAccountById(req, res);
    throw new HttpError(403, "")
});
accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword);
accountRouter.delete('/', controller.removeAccount)