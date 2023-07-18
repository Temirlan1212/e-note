import React from "react";
import { RadioProps, Radio as MUIRadio } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { UseFormRegister } from "react-hook-form";

interface IRadioProps extends RadioProps {
  label: string;
  register?: UseFormRegister<any>;
}

const Radio: React.FC<IRadioProps> = ({ label, register, name, ...props }) => {
  return (
    <FormControlLabel
      {...(register && name && register(name))}
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
