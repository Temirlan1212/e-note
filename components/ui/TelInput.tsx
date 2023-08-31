import { forwardRef, useState } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import { MuiTelInput, MuiTelInputProps } from "mui-tel-input";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

export type IFileInputProps = MuiTelInputProps & {
  inputType?: keyof typeof types;
  value?: File | File[] | null | string;
  onChange?: (file: File | File[] | null) => void;
};

export default forwardRef<HTMLDivElement, IFileInputProps>(function FileInput(
  { inputType = "secondary", helperText, value, onChange, ...rest }: IFileInputProps,
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

  const mergedStyles = { ...styles, ...rest.sx };

  const [phone, setPhone] = useState("");

  const handleOnChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  return (
    <FormControl error={inputType === "error"} ref={ref}>
      <MuiTelInput sx={mergedStyles} value={value ?? phone} onChange={onChange ?? handleOnChange} {...rest} />
      {helperText && <FormHelperText error={inputType === "error"}>{helperText}</FormHelperText>}
    </FormControl>
  );
});
