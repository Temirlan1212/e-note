import React, { forwardRef } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  LinearProgress,
  Select as MUISelect,
  SelectProps,
  SxProps,
  Theme,
} from "@mui/material";
import { MenuItem } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

enum types {
  primary = "primary.main",
  error = "error.main",
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
  loading?: boolean;
  boxSx?: SxProps<Theme>;
}

const Select: React.ForwardRefRenderFunction<HTMLDivElement, ISelectProps> = (
  {
    children,
    data = [],
    register,
    name,
    defaultValue,
    selectType = "secondary",
    valueField = "value",
    labelField = "label",
    helperText,
    loading = false,
    boxSx,
    ...props
  },
  ref
) => {
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
      borderColor: !props.disabled && types[selectType],
    },
    fontSize: "14px",
    borderRadius: 0,
  };

  const combineStyles = { ...props.sx, ...inputStyles };
  return (
    <FormControl sx={boxSx} error={selectType === "error"} ref={ref}>
      <MUISelect
        sx={combineStyles}
        {...(register && name && register(name))}
        {...props}
        defaultValue={defaultValue ?? ""}
        displayEmpty
        renderValue={(value) => {
          const item = data.find((item) => item?.[valueField] === value);
          if (value === "") return <Box color="#B4B9C1">{props?.placeholder ? props.placeholder : "----"}</Box>;
          return item?.[labelField] != null ? item[labelField] : "";
        }}
        {...props}
      >
        {loading && <LinearProgress color={selectType === "secondary" ? "secondary" : "success"} />}
        <MenuItem
          value=""
          sx={{
            color: "#B4B9C1",
            "&.Mui-selected": {
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#EFEFEF",
              },
            },
          }}
        >
          <em>{props?.placeholder ? props.placeholder : "----"}</em>
        </MenuItem>
        {data?.map((item) => (
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
      {helperText && <FormHelperText error={selectType === "error"}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default forwardRef<HTMLDivElement, ISelectProps>(Select);
