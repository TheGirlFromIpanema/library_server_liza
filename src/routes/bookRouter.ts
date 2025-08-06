import express, {Request, Response} from "express"
import {BookController} from "../controllers/BookController.js";
import {bookGenreQueryValidation, bookRemoveQueryValidation} from "../joiSchemas/bookSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const bookRouter = express.Router();

export const bookController = new BookController()

// bookRouter.post("/", bodyValidator(BookDtoJoiSchema), bookController.addBook)

// bookRouter.post("/", bookController.addBook)
bookRouter.post("/", (req: Request, res: Response) => {
    console.log("Route")
    bookController.addBook(req,res)
})

// bookRouter.get("/", bookController.getAllBooks)
bookRouter.get("/", (req, res) => {
    bookController.getAllBooks(req,res)
})

bookRouter.get('/genres', (req: Request, res: Response) => {
    const {error} = bookGenreQueryValidation.validate(req.query);
    if (error) throw new HttpError(400, error.message)
    bookController.getBooksByGenre(req,res)
})

bookRouter.put("/pickUp", (req: Request, res: Response) => {
    bookController.pickUpBook(req,res)
})

bookRouter.put("/return", (req: Request, res: Response) => {
    bookController.returnBook(req,res)
})

bookRouter.delete("/", (req: Request, res: Response) => {
    const {error} = bookRemoveQueryValidation.validate(req.query);
    if (error) throw new HttpError(400, error.message)
    bookController.removeBook(req,res)
})



