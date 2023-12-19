import { DatePicker as MUIDatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useLocale } from "next-intl";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS as en, ru } from "date-fns/locale";
import { FormControl, FormHelperText, SxProps, Theme } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { ruRU, enUS } from "@mui/x-date-pickers/locales";

enum types {
  error = "error.main",
  success = "success.main",
  secondary = "secondary.main",
}

interface IDatePickerProps<T = Date | null> extends Omit<DatePickerProps<T>, "onChange" | "value"> {
  onChange?: Function;
  value?: T;
  placeholder?: string;
  type?: keyof typeof types;
  helperText?: string;
  boxSx?: SxProps<Theme>;
}

const DatePicker: React.ForwardRefRenderFunction<HTMLDivElement, IDatePickerProps> = (props, ref) => {
  const { onChange, value, placeholder, type = "secondary", helperText, boxSx, sx, ...restProps } = props;

  const locale = useLocale();
  const theme = useTheme();

  const adapterLocale = locale === "en" ? en : ru;
  const localeText =
    locale === "en"
      ? enUS.components.MuiLocalizationProvider.defaultProps.localeText
      : ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

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
    ".Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: palette,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: palette,
    },
  };

  const mergedStyles = { ...inputStyles, ...sx };

  return (
    <FormControl error={type === "error"} sx={boxSx}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale} localeText={localeText}>
        <MUIDatePicker
          views={["day", "month", "year"]}
          format="dd.MM.yyyy"
          {...restProps}
          slots={{
            openPickerIcon: CalendarMonthIcon,
          }}
          sx={mergedStyles}
          value={value ?? null}
          onChange={(val) => (onChange ? onChange(val) : null)}
          slotProps={{ textField: { placeholder } }}
          inputRef={ref as any}
        />
        {helperText && <FormHelperText error={type === "error"}>{helperText}</FormHelperText>}
      </LocalizationProvider>
    </FormControl>
  );
};
export default forwardRef(DatePicker);
