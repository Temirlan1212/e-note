import React, { forwardRef } from "react";

import { CheckboxProps, Checkbox as MUICheckbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { UseFormRegister } from "react-hook-form";

interface ICheckboxProps extends Omit<CheckboxProps, "ref"> {
  label?: string;
  register?: UseFormRegister<any>;
  width?: string | number;
}

const Checkbox: React.ForwardRefRenderFunction<HTMLInputElement, ICheckboxProps> = (
  { label, register, width, name, ...props },
  ref
) => {
  return (
    <FormControlLabel
      sx={{
        width,
      }}
      control={
        <MUICheckbox
          {...props}
          {...(register && name && register(name))}
          sx={{
            color: "#1baa75",
            "&.Mui-checked": {
              color: "#1baa75",
            },
          }}
        />
      }
      label={label}
      ref={ref}
    />
  );
};

export default forwardRef<HTMLInputElement, ICheckboxProps>(Checkbox);
