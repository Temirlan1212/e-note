import React from "react";
import Select, { SelectProps } from "@mui/material/Select";
import { MenuItem } from "@mui/material";

interface CustomSelectProps extends SelectProps {
  data: any;
  onChange: any;
}

const SortSelect: React.FC<CustomSelectProps> = ({ children, data, ...rest }) => {
  return (
    <Select
      sx={{
        color: "#1BAA75",
        "& .MuiInputBase-input": {
          padding: "12px 14px",
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#1BAA75",
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
    >
      {data.map((item: { value: any; label: any }) => (
        <MenuItem
          sx={{
            color: "#1BAA75",
            fontSize: "16px",
            "&.Mui-selected": {
              backgroundColor: "#1baa751a",
            },
          }}
          key={item.value}
          value={item.value}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SortSelect;
