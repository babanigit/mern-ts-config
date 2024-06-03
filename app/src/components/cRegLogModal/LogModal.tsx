
import {useForm} from "react-hook-form"
import { UserModel } from "../aModal/userModal";
import { LoginCred } from "../aNetwork/note_api";

import * as NoteApi from "../aNetwork/note_api"
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import { useState } from "react";

import styleUtils from "../../style/utils.module.css"
import { UnauthorizedError } from "../zErrors/http-errors";



interface LoginModelProps {
    onDismiss: () => void;
    onLoginSuccessful: (user: UserModel) => void;
}

const LogModal = ({ onDismiss, onLoginSuccessful }: LoginModelProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCred>();

    async function onSubmit(credentials:LoginCred) {
        try {
            
            const newUser = await NoteApi.getLoginUser(credentials);


            console.log("hey bitch from logmodel from getLoginUser")
            console.log(newUser);

            onLoginSuccessful(newUser);

        } catch (error) {

            if (error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);

            // alert(error)
            // console.log(error);
        }
    }

    return (
        <>
            <Modal show onHide={onDismiss}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Login
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {errorText &&
                        <Alert variant="danger">
                            {errorText}
                        </Alert>
                    }

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <TextInputField
                            name="userName"
                            label="Username"
                            type="username"
                            placeholder="Username"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.userName}
                        />
                        <TextInputField
                            name="passwd"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.passwd}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={styleUtils.width100}>
                            login
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default LogModal

