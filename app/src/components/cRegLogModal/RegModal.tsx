
import { useForm } from "react-hook-form";
import { UserModel } from "../aModal/userModal";

import { RegisterCred } from "../aNetwork/note_api"
import * as NoteApi from "../aNetwork/note_api";

import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import { useState } from "react";

import styleUtils from "../../style/utils.module.css";
import { ConflictError } from "../zErrors/http-errors";



interface RegisterModelProps {
    onDismiss: () => void;
    onRegistrationSuccessful: (user: UserModel) => void;
}

// main fun
const RegModal = ({
    onDismiss,
    onRegistrationSuccessful,
}: RegisterModelProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    // REact Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterCred>();


    // fetch the Registration
    async function onSubmit(credentials: RegisterCred) {
        try {

            const newUser = await NoteApi.getRegisterUser(credentials);
            console.log(newUser);
            onRegistrationSuccessful(newUser);

        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);

            // alert(error);
            // console.log(error);
        }
    }

    return (
        <>
            <Modal show onHide={onDismiss}>
                <Modal.Header closeButton>
                    <Modal.Title>register </Modal.Title>
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
                            registerOptions={{ required: "Required Username" }}
                            error={errors.userName}
                        />
                        <TextInputField
                            name="email"

                            label="Email"
                            type="email"
                            placeholder="Email"
                            register={register}
                            registerOptions={{ required: "Required Email" }}
                            error={errors.email}
                        />
                        <TextInputField
                            name="passwd"

                            label="Password"
                            type="password"
                            placeholder="Password"
                            register={register}
                            registerOptions={{ required: "Required Password" }}
                            error={errors.passwd}
                        />
                        {/* <TextInputField
                            name="cPassword"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.passwd}
                        /> */}
                        <Button
                            type="submit"
                            disabled={isSubmitting} // so u cant submit it twice
                            className={styleUtils.width100}
                        >
                            register
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RegModal;
