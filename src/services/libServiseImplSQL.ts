import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {pool} from "../config/libConfig.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class LibServiceImplSQL implements LibService {

    async addBook(book: Book): Promise<boolean> {
        const result = await pool.query('INSERT INTO books VALUES(?,?,?,?,?)',
            [book.id, book.title, book.author, book.genre, book.status])
        if (!result)
            return Promise.resolve(false);
        else return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        const [result] = await pool.query('SELECT * FROM books');
        // console.log(result);
        return Promise.resolve(result as Book[]);
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const [result] = await pool.query('SELECT * FROM books WHERE genre = ?', [genre]);
        return Promise.resolve(result as Book[]);
    }

    pickUpBook(id: string, reader: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async removeBook(id: string): Promise<Book> {
        const [result] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        const books = result as Book[];
        if (books.length !== 0) {
            const book = books[0];
            await pool.query('DELETE FROM books WHERE id = ?', [id]);
            return book;
        } else
            throw new HttpError(400, "Book not found");
    }

    returnBook(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus): Promise<Book[]> {
        const [result] = await pool.query('SELECT * FROM books WHERE genre = ? AND status = ?', [genre,status]);
        return Promise.resolve(result as Book[]);
    }
}

export const libServiceSql = new LibServiceImplSQL();