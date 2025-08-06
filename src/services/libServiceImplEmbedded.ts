import {LibService} from "./libService.ts";
import {Book, BookGenres, BookStatus} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.js";

export class LibServiceImplEmbedded implements LibService {

    private books: Book[] = [];

    addBook(book: Book): boolean {
        const index = this.books.findIndex((item: Book) => item.id === book.id);
        if (index === -1) {
            this.books.push(book);
            return true;
        }
        return false;
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBooksByGenre(genre: BookGenres): Book[] {
        return this.books.filter(book => book.genre === genre);
    }

    pickUpBook(id: string, reader: string): void {
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

    removeBook(id: string): Book {
        const index = this.books.findIndex(elem => elem.id === id);
        if (index !== -1) {
            const temp = this.books[index];
            this.books.splice(index, 1);
            return temp;
        } else
            throw new HttpError(400, "Book not found");
    }

    returnBook(id: string): void {
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


}