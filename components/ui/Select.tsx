import React from "react";
import { Select as MUISelect, SelectProps } from "@mui/material";
import { MenuItem } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

enum types {
  primary = "#24334B",
  secondary = "success.main",
}

interface ISelectProps extends SelectProps {
  data: Record<string, any>[];
  labelField?: string;
  valueField?: string;
  onChange?: any;
  selectType?: keyof typeof types;
  register?: UseFormRegister<any>;
  error?: boolean;
}

const Select: React.FC<ISelectProps> = ({
  children,
  data = [],
  register,
  name,
  defaultValue,
  selectType = "secondary",
  valueField = "value",
  labelField = "label",
  error,
  ...props
}) => {
  const inputStyles = {
    color: error ? "text.primary" : types[selectType],
    minWidth: "226px",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: "12px 14px",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: error ? "error.main" : types[selectType],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: error ? "error.main" : "success.main",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: error ? "error.main" : "success.main",
    },
    ".MuiSvgIcon-root ": {
      fill: !error && "#1BAA75 !important",
    },
    fontSize: "14px",
    borderRadius: 0,
  };

  const combineStyles = { ...props.sx, ...inputStyles };
  return (
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
            "&& .Mui-selected": {
              backgroundColor: "#EFEFEF",
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
  );
};

export default Select;
