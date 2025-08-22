import Joi from 'joi'

export const ReaderDtoSchema = Joi.object({
    id:Joi.number().positive().max(999999999).min(100000000).required(),
    userName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
    birthdate: Joi.string().isoDate().required()
})

export const ChangePassDtoSchema = Joi.object({
    id:Joi.number().positive().max(999999999).min(100000000).required(),
    oldPassword: Joi.string().alphanum().min(8).required(),
    newPassword: Joi.string().alphanum().min(8).required(),
})