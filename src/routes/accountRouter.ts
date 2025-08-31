import express, {Response} from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../joiSchemas/bodyValidation.js";
import {
    ChangeInfoDtoSchema,
    ChangePassDtoSchema,
    ChangeRolesSchema, LoginSchema,
    ReaderDtoSchema
} from "../joiSchemas/accountSchema.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const accountRouter = express.Router();

accountRouter.post('/',bodyValidation(ReaderDtoSchema),controller.addAccount);
accountRouter.get('/reader_id', controller.getAccountById);
accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword);
accountRouter.delete('/', controller.removeAccount);
accountRouter.patch('/readerInfo', bodyValidation(ChangeInfoDtoSchema), controller.changeUserInfo);
accountRouter.put('/roles',bodyValidation(ChangeRolesSchema),controller.changeRoles)
accountRouter.post('/login', bodyValidation(LoginSchema), controller.login);