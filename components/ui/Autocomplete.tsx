import { ReactNode } from "react";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
  TextField,
  AutocompleteRenderInputParams,
  FormHelperText,
  Box,
} from "@mui/material";

enum types {
  danger = "danger.main",
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
}

export default function Autocomplete({
  type = "secondary",
  labelField = "label",
  helperText,
  renderInput,
  options,
  ...props
}: IAutocompleteProps) {
  const inputStyles = {
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

  const combineStyles = { ...props.sx, ...inputStyles };

  const defaultRenderInput =
    renderInput != null
      ? renderInput
      : (params: AutocompleteRenderInputParams) => (
          <Box>
            <TextField {...params} error={type === "danger"} />
            {helperText && <FormHelperText error={type === "danger"}>{helperText}</FormHelperText>}
          </Box>
        );

  return (
    <MuiAutocomplete
      options={options}
      getOptionLabel={(option) => option[labelField]}
      sx={combineStyles}
      {...props}
      renderInput={defaultRenderInput}
    />
  );
}
