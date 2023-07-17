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
          {...props}
          sx={{
            "&, &.Mui-checked": {
              color: "#1BAA75",
            },
          }}
        />
      }
      label={label}
    />
  );
};

export default Radio;
