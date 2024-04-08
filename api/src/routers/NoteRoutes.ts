import express, { Express, Response, Request } from "express";
import * as NotesController from "../controllers/NoteController"

const router = express.Router();


router.route("/").get(NotesController.getAuthNotes).post(NotesController.createNote);
router.route("/:noteId").get(NotesController.getNote).patch(NotesController.updateNote).delete(NotesController.deleteNote);

export default router;