import { TextField, TextFieldProps, styled } from "@mui/material";
import { FC } from "react";

type InputProps = TextFieldProps & {
  variant?: "filled" | "outlined" | "standard";
};

const Input: FC<InputProps> = ({ color = "success", variant = "outlined", ...props }) => {
  const StyledComponent = styled(TextField)(({ theme: { palette } }) => ({
    "& .MuiInputBase-root": {
      color: palette.text.primary,
      borderRadius: 0,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: palette.grey[300],
    },
    "& .MuiFormLabel-root:not(.Mui-focused)": {
      color: palette.text.primary,
    },
  }));

  return <StyledComponent variant={variant} color={color} {...props} />;
};

export default Input;
