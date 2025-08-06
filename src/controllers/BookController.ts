import {LibService} from "../services/libService.ts";
import {LibServiceImplEmbedded} from "../services/libServiceImplEmbedded.ts";
import {Request, Response} from "express";
import {Book, BookDto, BookGenres} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";
import {convertBookDtoToBook} from "../utils/tools.js";


export class BookController {

    private libService:LibService = new LibServiceImplEmbedded();

    getAllBooks(req: Request, res: Response) {
        const result = this.libService.getAllBooks();
        res.json(result);
    }

    addBook(req: Request, res: Response) {
        const dto = req.body as BookDto;
        const book:Book = convertBookDtoToBook(dto);
        const result = this.libService.addBook(book);
        if (result) {
            res.status(201).json(book);
        }
        else
            throw new HttpError(409, "Book not added")
    }

    getBooksByGenre(req: Request, res: Response) {
        const genre = req.query.genre as BookGenres;
        const result = this.libService.getBooksByGenre(genre);
        return res.json(result);
    }

    pickUpBook(req: Request, res: Response) {
        const body = req.body;
        if (!body.reader)
            body.reader = "Anonym";
        this.libService.pickUpBook(body.id, body.reader);
        res.send("Book successfully picked");
    }

    removeBook(req: Request, res: Response) {
        const id = req.query.bookId as string;
        const result = this.libService.removeBook(id);
        res.send(`Book with id ${result.id} successfully removed`);
    }

    returnBook(req: Request, res: Response) {
        const body = req.body;
        this.libService.removeBook(body.id);
        res.send("Book successfully removed");
    }

}