import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../../components/bNotes/NotesPageLoggedInView";
import NotesPageLogoutview from "../../components/bNotes/NotesPageLogoutview";
import styles from "../../style/notePage.module.css";
import { UserModel } from "../../components/aModal/userModal";

interface NotesPageProps {
  loggedInUser: UserModel | null;
}

const NotePage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <>
      <Container className={` bg-blue-100 ${styles.notesPage} `}>
        {loggedInUser ? (
          // true
          <NotesPageLoggedInView />
        ) : (
          <NotesPageLogoutview />
          // <></>
        )}
      </Container>
    </>
  );
};

export default NotePage;
