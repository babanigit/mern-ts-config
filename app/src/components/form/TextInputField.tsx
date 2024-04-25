import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any; //this is used, so we can get other type property which has not declared here
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props  // "...props" means its include all the properties
}: TextInputFieldProps) => {
  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        {...register(name, registerOptions)}
        isInvalid={!!error}
      />

      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
