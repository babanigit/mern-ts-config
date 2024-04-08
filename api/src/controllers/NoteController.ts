import { error } from "console";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import NoteModel from "../models/NoteSchema";
import { assertIsDefine } from "../middlewares/AssertDefine";
import mongoose, { ObjectId } from "mongoose";


export const getAuthNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getAuthenticatedUserId = req.session.userId
        assertIsDefine(getAuthenticatedUserId);

        const notes= await NoteModel.find({userId: getAuthenticatedUserId}).exec();

        res.status(201).json({
            notes,
            success: true,
            message: " all notes of authenticated user ",
        });

    } catch (error) {
        next(error);
    }
}

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const noteId = req.params.noteId;
        const getAuthenticatedUserId = req.session.userId;

        assertIsDefine(getAuthenticatedUserId)


        if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "invalid note id")

        const note = await NoteModel.findById(noteId).exec();
        if (!note) throw createHttpError(404, "note not found");

        if (note && note.userId && !note.userId.equals(getAuthenticatedUserId)) {
            throw createHttpError(401, "you cannot access this note")
        }
        res.status(201).json({
            note,
            success: true,
            message: " your note ",
        });


    } catch (error) {
        next(error);
    }
}

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, text } = req.body;
        const getAuthenticatedUserId = req.session.userId

        // here we are going to added req.session auth
        assertIsDefine(getAuthenticatedUserId)

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
