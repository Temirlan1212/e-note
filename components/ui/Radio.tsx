import React, { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import {
  RadioProps,
  Radio as MUIRadio,
  RadioGroup,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

interface IRadioProps extends RadioProps {
  labelField?: string;
  valueField?: string;
  row?: boolean;
  type?: keyof typeof types;
  helperText?: string;
  data: Record<string, any>[];
  defaultValue?: string | number;
  value?: string | number;
  register?: UseFormRegister<any>;
}

const Radio: React.ForwardRefRenderFunction<HTMLDivElement, IRadioProps> = (
  {
    labelField = "label",
    valueField = "value",
    row = false,
    type = "success",
    helperText,
    data,
    defaultValue,
    value,
    register,
    name,
    ...rest
  },
  ref
) => {
  const styles = {
    color: types["secondary"],
    "&.Mui-checked": {
      color: types[type],
    },
  };

  const combineStyles = { ...styles, ...rest.sx };

  return (
    <FormControl error={type === "error"} ref={ref}>
      <RadioGroup row={row} defaultValue={defaultValue} value={value != null ? value : ""}>
        {data.map(
          (item) =>
            item[labelField] != null &&
            item[valueField] != null && (
              <FormControlLabel
                key={item[valueField]}
                {...(register && name && register(name))}
                control={<MUIRadio sx={combineStyles} {...rest} />}
                value={item[valueField]}
                label={item[labelField]}
              />
            )
        )}
      </RadioGroup>
      {helperText && <FormHelperText error={type === "error"}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default forwardRef(Radio);
