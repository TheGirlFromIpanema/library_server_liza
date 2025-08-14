import express, {Request, Response} from "express"
import {BookController} from "../controllers/BookController.js";
import {bookGenreQueryValidation, bookRemoveQueryValidation} from "../joiSchemas/bookSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const bookRouter = express.Router();

export const bookController = new BookController()

// bookRouter.post("/", bodyValidator(BookDtoJoiSchema), bookController.addBook)

// bookRouter.post("/", bookController.addBook)
bookRouter.post("/", async(req: Request, res: Response) => {
    console.log("Route")
    await bookController.addBook(req,res)
})

// bookRouter.get("/", bookController.getAllBooks)
bookRouter.get("/", async(req, res) => {
    await bookController.getAllBooks(req,res)
})

bookRouter.get('/genres', async(req: Request, res: Response) => {
    const {error} = bookGenreQueryValidation.validate(req.query);
    if (error) throw new HttpError(400, error.message)
    await bookController.getBooksByGenre(req,res)
})

bookRouter.put("/pickUp", async(req: Request, res: Response) => {
    await bookController.pickUpBook(req,res)
})

bookRouter.put("/return", async(req: Request, res: Response) => {
    await bookController.returnBook(req,res)
})

bookRouter.delete("/", async(req: Request, res: Response) => {
    const {error} = bookRemoveQueryValidation.validate(req.query);
    if (error) throw new HttpError(400, error.message)
    await bookController.removeBook(req,res)
})

bookRouter.get('/gen_st', async(req: Request, res: Response) => {
    await bookController.getBooksByGengreAndStatus
});



