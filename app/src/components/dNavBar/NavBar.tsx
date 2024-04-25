import { Container, Nav, Navbar } from "react-bootstrap";
import { UserModel } from "../aModal/userModal"
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";

import { Link } from "react-router-dom";



interface NavBarProps {
    loggedInUser: UserModel | null;
    onRegisterClicked: () => void;
    onLoginClicked: () => void;
    onLogoutSuccessful: () => void;
}

const NavBar = ({ loggedInUser, onLoginClicked, onLogoutSuccessful, onRegisterClicked }: NavBarProps) => {
    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" sticky="top">

                <Container>
                    <Navbar.Brand as={Link} to="/"  >
                            note app
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar" >
                        <Nav >
                            <Nav.Link as={Link} to="/privacy" >
                                Privacy
                            </Nav.Link>
                        </Nav>
                        <Nav className="ms-auto" >
                            {
                                loggedInUser
                                    ? <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful} />
                                    : <NavBarLoggedOutView onLoginClicked={onLoginClicked} onRegisterClicked={onRegisterClicked} />
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar