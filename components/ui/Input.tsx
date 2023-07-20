import { FC, useState } from "react";

import { UseFormRegister } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";

type InputProps = TextFieldProps & {
  variant?: "filled" | "outlined" | "standard";
  register?: UseFormRegister<any>;
  name?: string;
};

const Input: FC<InputProps> = ({
  color = "success",
  variant = "outlined",
  type,
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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const mergedStyles = { ...inputStyles, ...props.sx };

  return (
    <TextField
      variant={variant}
      color={color}
      sx={mergedStyles}
      helperText={helperText}
      {...(register && register(name))}
      {...props}
      type={showPassword ? "text" : type}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff color="success" /> : <Visibility color="success" />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}
      }
    />
  );
};

export default Input;
