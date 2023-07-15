import React, { forwardRef } from "react";

import { CheckboxProps, Checkbox as MUICheckbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

interface ICheckboxProps extends Omit<CheckboxProps, "ref"> {
  label?: string;
}

const Checkbox: React.ForwardRefRenderFunction<HTMLInputElement, ICheckboxProps> = ({ label, ...props }, ref) => {
  return (
    <FormControlLabel
      control={
        <MUICheckbox
          {...props}
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
