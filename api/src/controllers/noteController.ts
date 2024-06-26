import  { NextFunction, Request, RequestHandler, Response } from "express";

import NoteModel from "../models/noteSchema"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefine } from "../utils/assertIsDefine";

import jwt from "jsonwebtoken"

interface CreateNoteBody {
  title?: string;
  text?: string;
}

import { JwtPayload } from "jsonwebtoken";

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const getCookieAuth = req.cookies.access_token

    // assertIsDefine("cookie", decoded.id);
    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(getCookieAuth, process.env.SECRET_WORD!) as JwtPayload;
    console.log(decoded.id)

    const notes = await NoteModel.find({ userId: decoded.id }).exec();
    res.status(200).json(notes);

  } catch (error) {
    next(error)
  }

}

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.noteId;
    const getCookieAuth = req.cookies.access_token

    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(getCookieAuth, process.env.SECRET_WORD!) as JwtPayload;
    console.log(decoded.id)

    if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "invalid note id")

    const newNotes = await NoteModel.findById(noteId).exec();
    if (!newNotes) throw createHttpError(404, "note not found");

    if (newNotes && newNotes.userId && !newNotes.userId.equals(decoded.id)) {
      throw createHttpError(401, "you cannot access this note")
    }

    res.status(201).json(newNotes)

  } catch (error) {
    next(error)
  }
}

export const createNotes: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
  try {
    const { title, text }: CreateNoteBody = req.body;
    const getCookieAuth = req.cookies.access_token

    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(getCookieAuth, process.env.SECRET_WORD!) as JwtPayload;
    console.log(decoded.id)

    if (!title) throw createHttpError(400, "note must have a title")
    const newNotes = await NoteModel.create({
      userId: decoded.id, //here we stored new property "userId" which has req.cookie.userId
      title,
      text,
    })
    res.status(201).json(newNotes)

  } catch (error) {
    next(error)
  }
}

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const getCookieAuth = req.cookies.access_token

    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(getCookieAuth, process.env.SECRET_WORD!) as JwtPayload;
    console.log(decoded.id)

    assertIsDefine("cookie", decoded.id);

    if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "invalid note id")
    if (!newTitle) throw createHttpError(400, "note must have a title")

    const note = await NoteModel.findById(noteId).exec();

    if (!note) throw createHttpError(404, "note not found");

    if (note && note.userId && !note.userId.equals(decoded.id)) {
      throw createHttpError(401, "you cannot access this note")
    }

    note.title = newTitle;
    note.text = newText;

    const updateNote = await note.save();
    res.status(201).json(updateNote)

  } catch (error) {
    next(error)
  }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const noteId = req.params.noteId
    const getCookieAuth = req.cookies.access_token

    // assertIsDefine("cookie", decoded.id);
    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(getCookieAuth, process.env.SECRET_WORD!) as JwtPayload;
    console.log(decoded.id)

    assertIsDefine("cookie", decoded.id);
    if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "invalid note id")

    const note = await NoteModel.findById(noteId).exec();

    if (!note) throw createHttpError(404, "note not found")

    if (note && note.userId && !note.userId.equals(decoded.id)) {
      throw createHttpError(401, "you cannot access this note")
    }

    await note.deleteOne({ _id: noteId });
    res.sendStatus(204);

  } catch (error) {
    next(error)
  }
}
