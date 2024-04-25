import { Button, Navbar } from "react-bootstrap";
import { UserModel } from "../aModal/userModal"

import * as NoteApi from "../aNetwork/note_api"

interface NavBarLoggedInViewProps {
    user:UserModel,
    onLogoutSuccessful:()=>void;

}

const NavBarLoggedInView = ({user,onLogoutSuccessful}:NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await NoteApi.getLogout();
            onLogoutSuccessful();

        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

  return (
    <>
    <Navbar.Text className="me-2">
        signed in as: {user.userName}
    </Navbar.Text>
    <Button onClick={logout}>log out</Button>
    
    </>
  )
}

export default NavBarLoggedInView