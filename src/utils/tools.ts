import {BookDto, BookGenres, BookStatus} from "../model/Book.ts";
import { v4 as uuidv4 } from 'uuid';
import {HttpError} from "../errorHandler/HttpError.js";

export function getGenre(genre: string) {
    const bookGenre = Object.values(BookGenres).find(v => v === genre)
    if (!bookGenre)
        throw new HttpError(400, "Wrong genre");
    else
        return bookGenre;
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