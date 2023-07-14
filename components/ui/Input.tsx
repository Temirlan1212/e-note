import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEventHandler, FC } from "react";
import { UseFormRegister } from "react-hook-form";

type InputProps = TextFieldProps & {
  variant?: "filled" | "outlined" | "standard";
  register: UseFormRegister<any>;
  name?: string;
};

const Input: FC<InputProps> = ({ color = "success", variant = "outlined", register, name = "name", ...props }) => {
  const inputStyles = {
    "& .MuiInputBase-root": {
      color: "#000000",
      borderRadius: 0,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#999999",
    },
    "& .MuiFormLabel-root:not(.Mui-focused)": {
      color: "#000000",
    },
  };

  const mergedStyles = { ...props.sx, ...inputStyles };

  return <TextField variant={variant} color={color} {...props} {...register(name)} sx={mergedStyles} />;
};

export default Input;
