import { Box, InputLabel } from "@mui/material";
import React from "react";
import { Controller, ControllerProps, UseFormTrigger } from "react-hook-form";
import { useTranslations } from "next-intl";
import DatePicker from "@/components/ui/DatePicker";
import { DatePickerProps } from "@mui/x-date-pickers";

type TProps = {
  datePicker: Partial<DatePickerProps<any>>;
};

type TControllerProps = Omit<ControllerProps<any>, "render">;

interface IDatePickerFormField extends TControllerProps {
  trigger: UseFormTrigger<any>;
  loading?: boolean;
  props?: Partial<TProps>;
  label?: string;
}

const DatePickerFormField = React.forwardRef<HTMLDivElement, IDatePickerFormField>(({ label, ...props }, ref) => {
  const t = useTranslations();
  const datePickerProps = props.props?.datePicker;
  const trigger = props.trigger;

  return (
    <Controller
      {...props}
      render={({ field, fieldState }) => {
        const fieldErrMessage = fieldState.error?.message;
        let errorMessage = fieldErrMessage;
        if (typeof field.value === "object" && field.value == "Invalid Date") {
          errorMessage = "invalid format";
        }

        return (
          <Box display="flex" flexDirection="column" width="100%">
            <InputLabel sx={{ fontWeight: 600 }}>{label ? t(label) : ""}</InputLabel>
            <DatePicker
              {...datePickerProps}
              sx={{ ".MuiInputBase-root": { fontWeight: 500 }, ...(datePickerProps?.sx || {}) }}
              type={errorMessage ? "error" : field.value ? "success" : "secondary"}
              helperText={errorMessage ? t(errorMessage) : ""}
              value={field.value != null ? new Date(field.value) : null}
              onChange={(...event: any[]) => {
                field.onChange(...event);
                trigger(field.name);
              }}
              ref={field.ref}
            />
          </Box>
        );
      }}
    />
  );
});

DatePickerFormField.displayName = "DatePickerFormField";
export default DatePickerFormField;
