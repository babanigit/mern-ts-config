import { Modal, Form, Button } from "react-bootstrap";
import { NoteModel } from "../aModal/noteModal"
import { useForm } from "react-hook-form";
import { NoteInput } from "../aNetwork/note_api"

import * as noteApi from "../aNetwork/note_api";
import TextInputField from "../form/TextInputField";

interface AddEditNoteProps {
  noteToEdit?: NoteModel;
  onDismiss: () => void;
  onNoteSaved: (note: NoteModel) => void;
}

const AddEditNoteDialog = ({
  noteToEdit,
  onDismiss,
  onNoteSaved,
}: AddEditNoteProps) => {


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    
    try {
      let noteResponse: NoteModel;


      // fetching add or edit notes
      if (noteToEdit) {
        noteResponse = await noteApi.updateNote(noteToEdit._id, input);
      } else {
        noteResponse = await noteApi.createNote(input);
      }

      // const noteRes = await noteApi.createNote(input);
      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
          <Modal.Title>{noteToEdit ? "edit note" : "add note"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
            
            <TextInputField
              name="title"
              label="Title"
              register={register}
              registerOptions={{ required: "Required title" }}
              error={errors.title}

              type="text"
              placeholder="Title"
            />

            <TextInputField
              name="text"
              label="Text"
              as="textarea"
              rows={5}
              placeholder="Text"
              register={register}
    
            />

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
            save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditNoteDialog;
