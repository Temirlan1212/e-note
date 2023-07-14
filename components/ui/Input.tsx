import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEventHandler, FC } from "react";
import { UseFormRegister } from "react-hook-form";

type InputProps = TextFieldProps & {
  variant?: "filled" | "outlined" | "standard";
  register?: UseFormRegister<any>;
  name?: string;
};

const Input: FC<InputProps> = ({ color = "success", variant = "outlined", register, name = "name", ...props }) => {
  const inputStyles = {
    "& .MuiInputBase-root": {
      color: "text.primary",
      borderRadius: 0,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "grey[300]",
    },
    "& .MuiFormLabel-root:not(.Mui-focused)": {
      color: "text.primary",
    },
    "& .MuiFormLabel-root(.Mui-focused)": {
      color: "success",
    },
  };

  const mergedStyles = { ...inputStyles, ...props.sx };

  return <TextField variant={variant} color={color} {...props} sx={mergedStyles} {...(register && register(name))} />;
};

export default Input;
