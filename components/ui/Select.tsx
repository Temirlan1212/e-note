import React from "react";
import { Select as MUISelect, SelectProps } from "@mui/material";
import { MenuItem } from "@mui/material";

interface ISelectProps extends SelectProps {
  data: any;
  onChange?: any;
  selectType?: "primary" | "secondary";
}

const Select: React.FC<ISelectProps> = ({ children, data, selectType = "secondary", ...props }) => {
  const inputStyles = {
    color: selectType === "primary" ? "#24334B" : "#1BAA75",
    minWidth: "226px",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: "12px 14px",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: selectType === "primary" ? "#CDCDCD" : "#1BAA75",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1BAA75",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1BAA75",
    },
    ".MuiSvgIcon-root ": {
      fill: "#1BAA75 !important",
    },
    fontSize: "14px",
    borderRadius: 0,
  };

  const combineStyles = { ...props.sx, ...inputStyles };
  return (
    <MUISelect sx={combineStyles} {...props}>
      {data.map((item: { value: any; label: any }) => (
        <MenuItem
          sx={{
            "&& .Mui-selected": {
              backgroundColor: "#EFEFEF",
            },
            color: "#24334B",
            fontSize: "16px",
          }}
          key={item.value}
          value={item.value}
        >
          {item.label}
        </MenuItem>
      ))}
    </MUISelect>
  );
};

export default Select;
