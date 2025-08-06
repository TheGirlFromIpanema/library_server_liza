import joi from 'joi'

export const bookDtoSchema = joi.object({
    title: joi.string().required(),
    author: joi.string().required(),
    genre: joi.string().required(),
    quantity: joi.number(),
    language: joi.string(),
})

export const pickRemoveSchema = joi.object({
    id: joi.string().required(),
    reader: joi.string(),
})

export const bookGenreQueryValidation = joi.object({
        genre: joi.string().required(),
    })


export const bookRemoveQueryValidation = joi.object({
        bookId: joi.string().required(),
    })
