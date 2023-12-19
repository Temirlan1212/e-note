import { forwardRef, useState } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import { MuiTelInput, MuiTelInputProps } from "mui-tel-input";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

export type ITelInputProps = MuiTelInputProps & {
  inputType?: keyof typeof types;
  helperText?: string | null;
  value?: string | null;
  onChange?: (value: string) => void;
};

export default forwardRef<HTMLDivElement, ITelInputProps>(function TelInput(
  { inputType = "secondary", helperText, value, sx, onChange, ...rest }: ITelInputProps,
  ref
) {
  const styles = {
    color: "text.primary",
    width: "100%",
    "& .MuiInputBase-root": {
      padding: 0,
      borderRadius: 0,
      borderColor: types[inputType],
    },
    "& .MuiInputBase-input": {
      padding: "10px",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: types[inputType],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: types[inputType],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: types[inputType],
    },
  };

  const mergedStyles = { ...styles, ...sx };

  const [phone, setPhone] = useState("");

  const handleOnChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  return (
    <FormControl error={inputType === "error"}>
      <MuiTelInput
        sx={mergedStyles}
        value={value ?? phone}
        onChange={onChange ?? handleOnChange}
        preferredCountries={["KG", "KZ", "AZ", "AM", "BY", "MD", "RU", "TJ", "TM", "UZ", "UA"]}
        {...rest}
        inputRef={ref}
      />
      {helperText && <FormHelperText error={inputType === "error"}>{helperText}</FormHelperText>}
    </FormControl>
  );
});
