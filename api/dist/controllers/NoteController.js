"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getAuthNotes = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const NoteSchema_1 = __importDefault(require("../models/NoteSchema"));
const AssertDefine_1 = require("../middlewares/AssertDefine");
const mongoose_1 = __importDefault(require("mongoose"));
const getAuthNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAuthenticatedUserId = req.session.userId;
        (0, AssertDefine_1.assertIsDefine)(getAuthenticatedUserId);
        const notes = yield NoteSchema_1.default.find({ userId: getAuthenticatedUserId }).exec();
        res.status(201).json({
            notes,
            success: true,
            message: " all notes of authenticated user ",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthNotes = getAuthNotes;
const getNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.noteId;
        const getAuthenticatedUserId = req.session.userId;
        (0, AssertDefine_1.assertIsDefine)(getAuthenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(noteId))
            throw (0, http_errors_1.default)(400, "invalid note id");
        const note = yield NoteSchema_1.default.findById(noteId).exec();
        if (!note)
            throw (0, http_errors_1.default)(404, "note not found");
        if (note && note.userId && !note.userId.equals(getAuthenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "you cannot access this note");
        }
        res.status(201).json({
            note,
            success: true,
            message: " your note ",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getNote = getNote;
const createNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, text } = req.body;
        const getAuthenticatedUserId = req.session.userId;
        // here we are going to added req.session auth
        (0, AssertDefine_1.assertIsDefine)(getAuthenticatedUserId);
        if (!title)
            throw (0, http_errors_1.default)(400, "note must have a title");
        const newNote = yield NoteSchema_1.default.create({
            userId: getAuthenticatedUserId, //here we stored new property "userId" which has req.session.userId
            title,
            text,
        });
        res.status(201).json({
            newNote,
            success: true,
            message: "note created",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createNote = createNote;
const updateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        next(error);
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNote = deleteNote;
