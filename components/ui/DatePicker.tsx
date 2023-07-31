import { DatePicker as MUIDatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useLocale } from "next-intl";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS, ru } from "date-fns/locale";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type Props<TInputDate> = {
  onChange?: any;
  value?: any;
  placeholder?: string;
  width?: string;
} & Omit<DatePickerProps<TInputDate>, "onChange" | "value">;

const DatePicker = <TInputDate, TDate = TInputDate>(props: Props<TInputDate>) => {
  const { onChange, value, placeholder, width, ...restProps } = props;

  const locale = useLocale();

  const adapterLocale = locale === "en" ? enUS : ru;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <MUIDatePicker
        views={["day", "month", "year"]}
        format="dd.MM.yy"
        {...restProps}
        slots={{
          openPickerIcon: CalendarMonthIcon,
        }}
        sx={{
          ".MuiInputBase-root": {
            fontSize: "14px",
            border: "1px solid #CDCDCD",
            background: " #FFF",
            borderRadius: 0,
          },
          ".MuiInputBase-input": {
            padding: "11px 14px",
          },
          ...restProps.sx,
        }}
        value={value ?? null}
        onChange={(val) => onChange(val)}
        slotProps={{ textField: { placeholder } }}
      />
    </LocalizationProvider>
  );
};
export default DatePicker;
