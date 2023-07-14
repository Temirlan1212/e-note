import React, { forwardRef } from "react";
import { CheckboxProps, Checkbox as MUICheckbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";

import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import RadioButtonUncheckedSharpIcon from "@mui/icons-material/RadioButtonUncheckedSharp";

interface ICheckboxProps extends Omit<CheckboxProps, "ref"> {
  label?: string;
  checkboxType?: "primary" | "secondary";
}

const Checkbox: React.ForwardRefRenderFunction<HTMLInputElement, ICheckboxProps> = (
  { label, checkboxType = "primary", ...props },
  ref
) => {
  return (
    <FormControlLabel
      control={
        <MUICheckbox
          {...props}
          icon={checkboxType === "secondary" ? <RadioButtonUncheckedSharpIcon /> : <CheckBoxOutlineBlankSharpIcon />}
          checkedIcon={checkboxType === "secondary" ? <CheckCircleIcon /> : <CheckBoxSharpIcon />}
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
