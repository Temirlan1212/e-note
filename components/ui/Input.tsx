import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEventHandler, FC } from "react";
import { UseFormRegister } from "react-hook-form";

type InputProps = TextFieldProps & {
  variant?: "filled" | "outlined" | "standard";
  register?: UseFormRegister<any>;
  name?: string;
};

const Input: FC<InputProps> = ({
  color = "success",
  variant = "outlined",
  helperText,
  register,
  name = "name",
  ...props
}) => {
  const inputStyles = {
    "& .MuiInputBase-root": {
      color: "text.primary",
      borderRadius: 0,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "grey[300]",
    },
    "& .MuiFormLabel-root:not(.Mui-focused)": {
      color: props.error ? "danger" : "text.primary",
    },
    "& .MuiFormLabel-root(.Mui-focused)": {
      color: "success",
    },
    "& .MuiFormHelperText-root": {
      color: props.error ? "danger" : "text.primary",
    },
  };

  const mergedStyles = { ...inputStyles, ...props.sx };

  return <TextField variant={variant} color={color} sx={mergedStyles} {...(register && register(name))} {...props} />;
};

export default Input;
