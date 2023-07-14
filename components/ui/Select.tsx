import React from "react";
import { Select as MUISelect, SelectProps } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MenuItem } from "@mui/material";

interface CustomSelectProps extends SelectProps {
  data: any;
  onChange: any;
}

const Select: React.FC<CustomSelectProps> = ({ children, data, ...rest }) => {
  return (
    <MUISelect
      sx={{
        color: "#24334B",
        minWidth: "250px",
        width: "100%",
        "& .MuiInputBase-input": {
          padding: "12px 14px",
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#CDCDCD",
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
      }}
      {...rest}
      autoWidth
      MenuProps={{
        sx: {
          "&& .Mui-selected": {
            backgroundColor: "#EFEFEF",
          },
        },
      }}
    >
      {data.map((item: { value: any; label: any }) => (
        <MenuItem
          sx={{
            color: "#24334B",
            fontSize: "16px",
            minWidth: "250px",
            width: "100%",
            "& .MuiList-padding .MuiMenu-list": {
              padding: 0,
            },
          }}
          classes={{ root: "MenuItem", selected: "selected", focusVisible: "focusVisible" }}
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
