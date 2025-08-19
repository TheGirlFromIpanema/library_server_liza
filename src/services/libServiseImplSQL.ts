import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {pool} from "../config/libConfig.js";
import {HttpError} from "../errorHandler/HttpError.js";
import { v4 as uuidv4 } from 'uuid';
import {User} from "../model/User.js";

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

    async pickUpBook(id: string, reader: string): Promise<void> {
        const [result] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        const books = result as Book[];
        const [userResult] = await pool.query('SELECT * FROM readers WHERE name = ?', [reader]);
        const users = userResult as User[];
        if (books.length !== 0) {
            const book = books[0];
            if (book.status !== BookStatus.ON_STOCK)
                throw new HttpError(409, "Book already on hand");
            let userID = '';
            if (users.length === 0){
                userID = uuidv4();
                await pool.query('INSERT INTO readers VALUES(?,?)',
                    [userID, reader]);
            }
            else {
                const user = users[0];
                userID = user.id;
            }
            await pool.query('INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES(?,?,?)',
                [id, userID, new Date()]);
            await pool.query('UPDATE books SET status = "on_hand" WHERE id = ?', [id]);
        } else
            throw new HttpError(400, "Book not found");
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

    async returnBook(id: string): Promise<void> {
        const [result] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        const books = result as Book[];
        if (books.length !== 0) {
            const book = books[0];
            if (book.status !== BookStatus.ON_HAND)
                throw new HttpError(409, "Book already on stock");
            await pool.query('UPDATE books_readers SET return_date = ? WHERE book_id = ?',
                [new Date(), id]);
            await pool.query('UPDATE books SET status = "on_stock" WHERE id = ?', [id]);
        } else
            throw new HttpError(400, "Book not found");
    }

    async getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus): Promise<Book[]> {
        const [result] = await pool.query('SELECT * FROM books WHERE genre = ? AND status = ?', [genre,status]);
        return Promise.resolve(result as Book[]);
    }
}

export const libServiceSql = new LibServiceImplSQL();