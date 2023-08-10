import React, { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { CheckboxProps, FormControl, FormControlLabel, FormHelperText, Checkbox as MUICheckbox } from "@mui/material";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

interface ICheckboxProps extends Omit<CheckboxProps, "ref"> {
  label?: string;
  register?: UseFormRegister<any>;
  width?: string | number;
  type?: keyof typeof types;
  helperText?: string;
}

const Checkbox: React.ForwardRefRenderFunction<HTMLInputElement, ICheckboxProps> = (
  { label, register, type = "secondary", helperText, name, ...rest },
  ref
) => {
  const styles = {
    color: types[type],
  };

  const combineStyles = { ...styles, ...rest.sx };

  return (
    <FormControl error={type === "error"} ref={ref}>
      <FormControlLabel
        sx={{
          ".MuiFormControlLabel-label": {
            whiteSpace: "wrap",
          },
        }}
        control={<MUICheckbox {...rest} {...(register && name && register(name))} sx={combineStyles} />}
        label={label}
      />
      {helperText && <FormHelperText error={type === "error"}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default forwardRef<HTMLInputElement, ICheckboxProps>(Checkbox);
