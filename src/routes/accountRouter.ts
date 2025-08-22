import express from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../joiSchemas/bodyValidation.js";
import {ChangePassDtoSchema, ReaderDtoSchema} from "../joiSchemas/accountSchema.js";



export const  accountRouter = express.Router();

accountRouter.post('/',bodyValidation(ReaderDtoSchema),controller.addAccount);
accountRouter.get('/reader_id', controller.getAccountById);
accountRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword);
accountRouter.delete('/', controller.removeAccount)