import { DatePicker as MUIDatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS, ru } from "date-fns/locale";

import DateOpenIcon from "@/public/icons/date-open.svg";
import { useLocale } from "next-intl";

type Props<TInputDate> = {
  onChange?: any;
  value?: any;
  placeholder?: string;
} & Omit<DatePickerProps<TInputDate>, "onChange" | "value">;

const theme = createTheme({
  palette: {
    primary: {
      light: "#1BAA75",
      main: "#1BAA75",
      dark: "#1BAA75",
      contrastText: "#fff",
    },
  },
});

const DatePicker = <TInputDate, TDate = TInputDate>(props: Props<TInputDate>) => {
  const { onChange, value, placeholder, ...restProps } = props;

  const locale = useLocale();

  const adapterLocale = locale === "en" ? enUS : ru;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <ThemeProvider theme={theme}>
        <MUIDatePicker
          views={["day", "month", "year"]}
          format="dd.MM.yy"
          {...restProps}
          slots={{
            openPickerIcon: DateOpenIcon,
          }}
          sx={{
            width: {
              xs: "100%",
              md: "150px",
            },
            ".MuiInputBase-root": {
              fontSize: "14px",
              border: "1px solid #CDCDCD",
              background: " #FFF",
              borderRadius: 0,
            },
            ".MuiInputBase-input": {
              padding: "11px 14px",
            },
          }}
          value={value ?? null}
          onChange={(val) => onChange(val)}
          slotProps={{ textField: { placeholder } }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};
export default DatePicker;
