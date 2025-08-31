import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {configuration} from "../config/libConfig.js";
import {HttpError} from "../errorHandler/HttpError.js";
import { v4 as uuidv4 } from 'uuid';
import {User} from "../model/User.js";
import {fromSqlDocToArray} from "../utils/tools.js";

export class LibServiceImplSQL implements LibService {

    async addBook(book: Book): Promise<boolean> {
        const result = await configuration.pool.query('INSERT INTO books VALUES(?,?,?,?,?)',
            [book.id, book.title, book.author, book.genre, book.status])
        if (!result)
            return Promise.resolve(false);
        else return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        const [result] = await  configuration.pool.query(`SELECT b.id AS book_id, b.title, b.author, b.genre, b.status,
        r.id AS reader_id, r.name AS reader_name, br.pick_date, br.return_date 
        FROM books b LEFT JOIN books_readers br ON b.id = br.book_id
        LEFT JOIN readers r ON r.id = br.reader_id`);
        //console.log(result);
        return Promise.resolve(fromSqlDocToArray(result as any[]));
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const [result] = await  configuration.pool.query(`SELECT b.id AS book_id, b.title, b.author, b.genre, b.status,
        r.id AS reader_id, r.name AS reader_name, br.pick_date, br.return_date FROM books b
        LEFT JOIN books_readers br ON b.id = br.book_id LEFT JOIN readers r ON r.id = br.reader_id 
        WHERE b.genre = ?`, [genre]);

        return Promise.resolve(fromSqlDocToArray(result as any[]));
    }

    async pickUpBook(id: string, reader: number): Promise<void> {
        const [result] = await  configuration.pool.query('SELECT * FROM books WHERE id = ?', [id]);
        const books = result as Book[];
        const [userResult] = await  configuration.pool.query('SELECT * FROM readers WHERE name = ?', [reader]);
        const users = userResult as User[];
        if (books.length !== 0) {
            const book = books[0];
            if (book.status !== BookStatus.ON_STOCK)
                throw new HttpError(409, "Book already on hand");
            let userID = '';
            if (users.length === 0){
                userID = uuidv4();
                await  configuration.pool.query('INSERT INTO readers VALUES(?,?)',
                    [userID, reader]);
            }
            else {
                const user = users[0];
                userID = user.id;
            }
            await  configuration.pool.query('INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES(?,?,?)',
                [id, userID, new Date()]);
            await  configuration.pool.query('UPDATE books SET status = ? WHERE id = ?', ["on_hand",id]);
        } else
            throw new HttpError(400, "Book not found");
    }

    async removeBook(id: string): Promise<Book> {
        const [result] = await  configuration.pool.query('SELECT * FROM books WHERE id = ?', [id]);
        const books = result as Book[];
        if (books.length !== 0) {
            const book = books[0];
            await  configuration.pool.query('DELETE FROM books WHERE id = ?', [id]);
            return book;
        } else
            throw new HttpError(400, "Book not found");
    }

    async returnBook(id: string): Promise<void> {
        const [result] = await  configuration.pool.query('SELECT * FROM books WHERE id = ?', [id]);
        const books = result as Book[];
        if (books.length !== 0) {
            const book = books[0];
            if (book.status !== BookStatus.ON_HAND)
                throw new HttpError(409, "Book already on stock");
            await  configuration.pool.query('UPDATE books_readers SET return_date = ? WHERE book_id = ?',
                [new Date(), id]);
            await  configuration.pool.query('UPDATE books SET status = ? WHERE id = ?', ["on_stock",id]);
        } else
            throw new HttpError(400, "Book not found");
    }

    async getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus): Promise<Book[]> {
        const [result] = await  configuration.pool.query(`SELECT  b.id AS book_id, b.title, b.author, b.genre, b.status,
        r.id AS reader_id, r.name AS reader_name, br.pick_date, br.return_date
        FROM books b LEFT JOIN books_readers br ON b.id = br.book_id
        LEFT JOIN readers r ON r.id = br.reader_id
        WHERE b.genre = ? AND b.status = ?`, [genre, status]);

        return Promise.resolve(fromSqlDocToArray(result as any[]));
    }
}

export const libServiceSql = new LibServiceImplSQL();