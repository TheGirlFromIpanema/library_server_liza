import {LibService} from "./libService.ts";
import {Book, BookGenres, BookStatus} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.js";

export class LibServiceImplEmbedded implements LibService {


    private books: Book[] = [];

    async addBook(book: Book): Promise<boolean> {
        const index = this.books.findIndex((item: Book) => item.id === book.id);
        if (index === -1) {
            this.books.push(book);
            return new Promise(resolve => resolve(true));
        }
        return Promise.resolve(false);
    }

    async getAllBooks(): Promise<Book[]> {
        return Promise.resolve([...this.books]);
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        return Promise.resolve(this.books.filter(book => book.genre === genre));
    }

    async pickUpBook(id: string, reader: string): Promise<void> {
        const index = this.books.findIndex(elem => elem.id === id);
        if (index !== -1) {
            if (this.books[index].status === BookStatus.ON_HAND)
                throw new HttpError(400, "Book already on hand");
            this.books[index].status = BookStatus.ON_HAND;
            const pickDate = new Date().toLocaleString("en-GB", {
                timeZone: "Asia/Jerusalem",
                hour12: false,
            });
            this.books[index].pickList.push({
                reader: reader,
                pick_date: pickDate,
                return_date: null,
            })
        }
        else throw new HttpError(400, "Book not found.");
    }

    async removeBook(id: string): Promise<Book> {
        const index = this.books.findIndex(elem => elem.id === id);
        if (index !== -1) {
            const temp = this.books[index];
            this.books.splice(index, 1);
            return Promise.resolve(temp);
        } else
            throw new HttpError(400, "Book not found");
    }

    async returnBook(id: string): Promise<void> {
        const index = this.books.findIndex(elem => elem.id === id);
        if (index !== -1) {
            if (this.books[index].status === BookStatus.ON_STOCK)
                throw new HttpError(400, "Book already on stock");
            this.books[index].status = BookStatus.ON_STOCK;
            this.books[index].pickList[this.books[index].pickList.length - 1].return_date = new Date().toLocaleString("en-GB", {
                timeZone: "Asia/Jerusalem",
                hour12: false,
            });
        }
        else throw new HttpError(400, "Book not found");
    }

    getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus): Promise<Book[]> {
        return Promise.resolve([]);
    }




}