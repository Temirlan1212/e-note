import { forwardRef, ReactNode } from "react";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
  TextField,
  AutocompleteRenderInputParams,
  FormHelperText,
  Box,
} from "@mui/material";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

export interface IAutocompleteProps<T = any>
  extends Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, "renderInput"> {
  options: readonly T[];
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
  labelField?: string;
  helperText?: string;
  type?: keyof typeof types;
  textFieldPlaceholder?: string;
}

export default forwardRef<HTMLDivElement, IAutocompleteProps>(function Autocomplete(
  {
    type = "secondary",
    labelField = "label",
    helperText,
    renderInput,
    textFieldPlaceholder,
    options,
    ...rest
  }: IAutocompleteProps,
  ref
) {
  const placeholderStyles = {
    "& input::placeholder": {
      color: "#000",
      fontWeight: 500,
    },
  };

  const styles = {
    color: "text.primary",
    width: "100%",
    "& .MuiInputBase-root": {
      padding: "3px",
      borderRadius: 0,
      borderColor: types[type],
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: types[type],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: types[type],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: types[type],
    },
  };

  const combineStyles = { ...styles, ...rest.sx };

  const defaultRenderInput =
    renderInput != null
      ? renderInput
      : (params: AutocompleteRenderInputParams) => (
          <Box>
            <TextField sx={placeholderStyles} {...params} placeholder={textFieldPlaceholder} error={type === "error"} />
            {helperText && <FormHelperText error={type === "error"}>{helperText}</FormHelperText>}
          </Box>
        );

  return (
    <MuiAutocomplete
      options={options ?? []}
      getOptionLabel={(option) => option[labelField]}
      sx={combineStyles}
      ref={ref}
      {...rest}
      renderInput={defaultRenderInput}
    />
  );
});
