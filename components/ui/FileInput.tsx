import { forwardRef, useState } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import { MuiFileInput, MuiFileInputProps } from "mui-file-input";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

export type IFileInputProps = MuiFileInputProps<boolean | undefined> & {
  inputType?: keyof typeof types;
  value?: File | File[] | null;
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

  const [file, setFile] = useState<File | File[] | null>(null);

  const handleOnChange = (file: File | File[] | null) => {
    setFile(file);
  };

  return (
    <FormControl error={inputType === "error"} ref={ref}>
      <MuiFileInput sx={mergedStyles} value={value ?? file} onChange={onChange ?? handleOnChange} {...rest} />
      {helperText && <FormHelperText error={inputType === "error"}>{helperText}</FormHelperText>}
    </FormControl>
  );
});
