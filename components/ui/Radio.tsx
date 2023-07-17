import React from "react";
import { RadioProps, Radio as MUIRadio } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

interface IRadioProps extends RadioProps {
  label: string;
}

const Radio: React.FC<IRadioProps> = ({ label, ...props }) => {
  return (
    <FormControlLabel
      control={
        <MUIRadio
          sx={{
            "&, &.Mui-checked": {
              color: "#1BAA75",
            },
          }}
          {...props}
        />
      }
      label={label}
    />
  );
};

export default Radio;
