import {LibService} from "../services/libService.ts";
import {LibServiceImplEmbedded} from "../services/libServiceImplEmbedded.ts";
import {Request, Response} from "express";
import {Book, BookDto, BookGenres} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";
import {convertBookDtoToBook, getStatus, getGenre, checkReaderId} from "../utils/tools.js";
import {bookDtoSchema, pickBookSchema, returnBookSchema} from "../joiSchemas/bookSchema.js";
import {libServiceMongo as service} from "../services/libServiceImplMongo.js";
//import {libServiceSql as service} from "../services/libServiseImplSQL.js";


export class BookController {

    // private libService: LibService = new LibServiceImplEmbedded();

    async getBooksByGenreAndStatus(req: Request, res: Response) {
        const {genre, status} = req.query;
        const genre_upd = getGenre(genre as string);
        const status_upd = getStatus(status as string);
        const result = await service.getBooksByGenreAndStatus(genre_upd, status_upd);
        res.json(result);
    }

    async getAllBooks(req: Request, res: Response) {
        const result = await service.getAllBooks();
        res.json(result);
    }

    async addBook(req: Request, res: Response) {
        const dto = req.body as BookDto;
        if (!dto) throw new HttpError(409, 'Bad request: Missing Body!')
        const {error} = bookDtoSchema.validate(dto);
        if (error) throw new HttpError(400, error.message)
        const book: Book = convertBookDtoToBook(dto);
        const result = await service.addBook(book);
        if (result) {
            res.status(201).json(book);
        } else
            throw new HttpError(409, "Book not added")
    }

    async getBooksByGenre(req: Request, res: Response) {
        const genre = req.query.genre as BookGenres;
        const bookGenre = Object.values(BookGenres).find(v => v === genre)
        if (!bookGenre)
            throw new HttpError(400, "Wrong genre");
        const result = await service.getBooksByGenre(genre);
        return res.json(result);
    }

    async pickUpBook(req: Request, res: Response) {
        const body = req.body;
        if (!body) throw new HttpError(409, 'Bad request: Missing Body!')
        const {error} = pickBookSchema.validate(body);
        if (error) throw new HttpError(400, error.message)
        const readerID = checkReaderId(body.reader);
        await service.pickUpBook(body.id, readerID);
        res.send("Book successfully picked");
    }

    async removeBook(req: Request, res: Response) {
        const id = req.query.bookId as string;
        const result = await service.removeBook(id);
        res.send(`Book with id ${result.id} successfully removed`);
    }

    async returnBook(req: Request, res: Response) {
        const body = req.body;
        if (!body) throw new HttpError(409, 'Bad request: Missing Body!')
        const {error} = returnBookSchema.validate(body);
        if (error) throw new HttpError(400, error.message)
        await service.returnBook(body.id);
        res.send("Book successfully returned");
    }

    async getBooksByUser(req: Request, res: Response) {
        const id = checkReaderId(req.query.userId as string);
        const result = await service.getBooksByUserId(id);
        return res.json(result);
    }
}