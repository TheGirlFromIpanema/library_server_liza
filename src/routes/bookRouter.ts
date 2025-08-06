import express, {Request, Response, NextFunction} from "express"
import {BookController} from "../controllers/BookController.js";

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
    bookController.getBooksByGenre(req,res)
})

bookRouter.put("/pickUp", (req: Request, res: Response) => {
    bookController.pickUpBook(req,res)
})

bookRouter.put("/return", (req: Request, res: Response) => {
    bookController.returnBook(req,res)
})

bookRouter.delete("/", (req: Request, res: Response) => {
    bookController.removeBook(req,res)
})



