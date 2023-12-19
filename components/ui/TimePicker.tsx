import { LocalizationProvider, TimePicker as MUITimePicker, TimePickerProps } from "@mui/x-date-pickers";
import { useLocale } from "next-intl";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { ruRU, enUS } from "@mui/x-date-pickers/locales";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS as en, ru } from "date-fns/locale";
import { FormControl, FormHelperText } from "@mui/material";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

interface ITimePickerProps<T = Date | null> extends Omit<TimePickerProps<T>, "onChange" | "value"> {
  onChange?: Function;
  value?: T;
  placeholder?: string;
  type?: keyof typeof types;
  helperText?: string;
}

const TimePicker: React.ForwardRefRenderFunction<HTMLDivElement, ITimePickerProps> = (props, ref) => {
  const { onChange, value, placeholder, sx, helperText, type = "secondary", ...rest } = props;

  const locale = useLocale();
  const theme = useTheme();

  const adapterLocale = locale === "en" ? en : ru;
  const localeText =
    locale === "en"
      ? enUS.components.MuiLocalizationProvider.defaultProps.localeText
      : ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
  const ampm = locale === "en";

  const palettes: Record<string, any> = theme.palette;
  const splittedType = types[type].trim().split(".");
  const palette = splittedType.reduce((acc, cur) => {
    return acc != null ? acc[cur] : acc;
  }, palettes);

  const inputStyles = {
    color: "text.primary",
    width: "100%",
    "& .MuiInputBase-root": {
      borderRadius: 0,
    },
    "& .MuiInputBase-input": {
      padding: "10px",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: palette,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: palette,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: palette,
    },
  };

  const mergedStyles = { ...inputStyles, ...sx };

  return (
    <FormControl error={type === "error"}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale} localeText={localeText}>
        <MUITimePicker
          ampm={ampm}
          sx={mergedStyles}
          value={value ?? null}
          onChange={(val) => (onChange ? onChange(val) : null)}
          {...rest}
          inputRef={ref as any}
        />
        {helperText && <FormHelperText error={type === "error"}>{helperText}</FormHelperText>}
      </LocalizationProvider>
    </FormControl>
  );
};

export default forwardRef(TimePicker);
