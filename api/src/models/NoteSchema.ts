import mongoose, { InferSchemaType, Schema } from "mongoose";

const noteSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    text: {
        type: String,
    },

}, {
    timestamps: true,
})

type Note = InferSchemaType<typeof noteSchema>;


const NoteModel = mongoose.model<Note>("notesData", noteSchema);

export default NoteModel;