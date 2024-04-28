import styles from "../../style/note.module.css";
import styleUtils from "../../style/utils.module.css";

import { NoteModel } from "../aModal/noteModal";
import { Card } from "react-bootstrap";
import { FormatDate } from "../../util/FormateData";

import { MdDelete } from "react-icons/md";

interface NoteProps {
  note: NoteModel;
  onNoteClicked: (note: NoteModel) => void;
  onDeleteNoteClicked: (note: NoteModel) => void;
  className?: string;
}
const Note = ({
  note,
  onNoteClicked,
  className,
  onDeleteNoteClicked,
}: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "updated: " + FormatDate(updatedAt);
  } else {
    createdUpdatedText = "created: " + FormatDate(createdAt);
  }

  return (
    <>
      <Card
        className={`${styles.noteCard} ${className}`}
        onClick={() => onNoteClicked(note)}
      >
        <Card.Body className={` ${styles.cardBody}`}>
          <Card.Title
            className={`bg-red-200 rounded-md ${styleUtils.flexCenter} `}
          >
            {title}
            <MdDelete
              onClick={(e) => {
                onDeleteNoteClicked(note);
                e.stopPropagation();
              }}
              className="text-muted ms-auto"
            />
          </Card.Title>
          <Card.Text className={styles.cardText}>{text}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
      </Card>
    </>
  );
};

export default Note;
