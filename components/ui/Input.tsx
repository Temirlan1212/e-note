import { forwardRef, useState } from "react";

import { UseFormRegister } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BoxProps, IconButton, InputAdornment, SxProps, TextField, TextFieldProps } from "@mui/material";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

export type IInputProps = TextFieldProps & {
  variant?: "filled" | "outlined" | "standard";
  register?: UseFormRegister<any>;
  name?: string;
  inputType?: keyof typeof types;
};

const Input: React.ForwardRefRenderFunction<HTMLDivElement, IInputProps> = (
  {
    color = "success",
    variant = "outlined",
    type,
    helperText,
    register,
    name = "name",
    inputType = "secondary",
    sx,
    ...props
  },
  ref
) => {
  const styles = {
    color: "text.primary",
    width: "100%",
    "& .MuiInputBase-root": {
      borderRadius: 0,
      borderColor: types[inputType],
    },
    "& .MuiInputBase-input": {
      padding: "10px",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: types[inputType],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: types[inputType],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: types[inputType],
    },
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const combineStyles = { ...styles, ...sx };

  return (
    <TextField
      error={inputType === "error"}
      variant={variant}
      color={color}
      sx={combineStyles}
      helperText={helperText}
      {...(register && register(name))}
      type={showPassword ? "text" : type}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff color="inherit" /> : <Visibility color="inherit" />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}
      }
      {...props}
      inputRef={ref}
      onWheel={(e: any) => (type === "number" ? e.target.blur() : e)}
    />
  );
};

export default forwardRef<HTMLDivElement, IInputProps>(Input);
