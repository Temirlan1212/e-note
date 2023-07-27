import React, { forwardRef } from "react";
import { FormControl, FormHelperText, Select as MUISelect, SelectProps } from "@mui/material";
import { MenuItem } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

enum types {
  danger = "danger.main",
  success = "success.main",
  secondary = "secondary.main",
}

interface ISelectProps extends SelectProps {
  data: Record<string, any>[];
  labelField?: string;
  valueField?: string;
  onChange?: any;
  selectType?: keyof typeof types;
  register?: UseFormRegister<any>;
  helperText?: string;
}

const Select: React.ForwardRefRenderFunction<HTMLDivElement, ISelectProps> = ({
  children,
  data = [],
  register,
  name,
  defaultValue,
  selectType = "secondary",
  valueField = "value",
  labelField = "label",
  helperText,
  ...props
}) => {
  const inputStyles = {
    color: "text.primary",
    minWidth: "226px",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: "12px 14px",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: types[selectType],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: types[selectType],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: types[selectType],
    },
    fontSize: "14px",
    borderRadius: 0,
  };

  const combineStyles = { ...props.sx, ...inputStyles };
  return (
    <FormControl error={selectType === "danger"}>
      <MUISelect
        sx={combineStyles}
        {...props}
        {...(register && name && register(name))}
        defaultValue={defaultValue ?? ""}
      >
        <MenuItem value="">---</MenuItem>
        {data.map((item) => (
          <MenuItem
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#EFEFEF",
                "&:hover": {
                  backgroundColor: "#EFEFEF",
                },
              },
              color: "#24334B",
              fontSize: "16px",
            }}
            key={item[valueField]}
            value={item[valueField]}
          >
            {item[labelField]}
          </MenuItem>
        ))}
      </MUISelect>
      {helperText && <FormHelperText error={selectType === "danger"}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default forwardRef<HTMLDivElement, ISelectProps>(Select);
