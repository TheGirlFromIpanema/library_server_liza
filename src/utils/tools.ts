import {Book, BookDto, BookGenres, BookStatus} from "../model/Book.ts";
import { v4 as uuidv4 } from 'uuid';
import {HttpError} from "../errorHandler/HttpError.js";
import {Reader, ReaderDto} from "../model/Reader.js";
import bcrypt from "bcryptjs";
import {Roles} from "./libTypes.js";
import jwt from 'jsonwebtoken';
import {configuration} from "../config/libConfig.js";

export function getGenre(genre: string) {
    const bookGenre = Object.values(BookGenres).find(v => v === genre)
    if (!bookGenre)
        throw new HttpError(400, "Wrong genre");
    else
        return bookGenre;
}

export function getRole(role: string) {
    const readerRole = Object.values(Roles).find(v => v === role)
    if (!readerRole)
        throw new HttpError(400, "Wrong role");
    else
        return readerRole;
}

export function getStatus(status: string) {
    const bookStatus = Object.values(BookStatus).find(v => v === status);

    if(!bookStatus) throw  new HttpError(400, "Wrong status")
    else return bookStatus;
}

export const convertBookDtoToBook = (dto: BookDto) => {
    return {
        id: uuidv4(),
        title: dto.title,
        author: dto.author,
        genre: getGenre(dto.genre),
        status: BookStatus.ON_STOCK,
        pickList: []
    }
}

export const fromSqlDocToArray = (doc: any[]): Book[] => {
    const books: Book[] = [];

    for (const item of doc) {
        let book = books.find(b => b.id === item.book_id);

        if (!book) {
            book = {
                id: item.book_id,
                title: item.title,
                author: item.author,
                genre: item.genre,
                status: item.status,
                pickList: []
            };
            books.push(book);
        }

        if (item.reader_id) {
            book.pickList.push({
                reader: item.reader_name,
                readerId: item.reader_id,
                pick_date: item.pick_date,
                return_date: item.return_date
            });
        }
    }

    return books;
}

export const convertReaderDtoToReader = (dto:ReaderDto):Reader => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.password, salt);

    return {
        _id: dto.id,
        userName: dto.userName,
        email: dto.email,
        birthdate: dto.birthdate,
        passHash: hash,
        roles: [Roles.USER]
    }
}

export const checkReaderId = (id: string | undefined) => {
    if (!id) throw new HttpError(400, "No ID in request");
    const _id = parseInt(id as string);
    if (!_id) throw new HttpError(400, "ID must be a number");
    return _id;
}

export const getJWT = (userId:number, roles: Roles[]) => {
    const payload = {roles: JSON.stringify(roles)};
    const secret = configuration.jwt.secret;
    const options = {
        expiresIn: configuration.jwt.exp as any,
        subject: userId.toString()
    }
    return jwt.sign(payload, secret, options);
}