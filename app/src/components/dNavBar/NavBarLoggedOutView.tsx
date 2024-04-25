import { Button } from "react-bootstrap";


interface NavBarLoggedOutViewProps {
    onRegisterClicked:()=>void;
    onLoginClicked:()=>void;

}

const NavBarLoggedOutView = ({onLoginClicked,onRegisterClicked}:NavBarLoggedOutViewProps) => {


  return (
    <>
    <Button onClick={onRegisterClicked}>register</Button>
    <Button onClick={onLoginClicked}>login</Button>
    </>

  )
}

export default NavBarLoggedOutView