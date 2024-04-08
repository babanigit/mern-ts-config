import { error } from "console";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import NoteModel from "../models/NoteSchema";


export const getAuthNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {


        console.log(req.session.userId)


    } catch (error) {
        next(error);
    }
}

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {


    } catch (error) {
        next(error);
    }
}

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, text } = req.body;
        const getAuthenticatedUserId = req.session.userId

        // here we are going to added req.session auth

        if (!title) throw createHttpError(400, "note must have a title")
        const newNote = await NoteModel.create({
            userId: getAuthenticatedUserId, //here we stored new property "userId" which has req.session.userId
            title,
            text,
        })

        res.status(201).json({
            newNote,
            success: true,
            message: "note created",
        });

    } catch (error) {
        next(error);
    }
}

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {


    } catch (error) {
        next(error);
    }
}

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {


    } catch (error) {
        next(error);
    }
}
