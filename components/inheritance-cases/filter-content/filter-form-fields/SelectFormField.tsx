import { Box, BoxProps, InputLabel } from "@mui/material";
import React from "react";
import { Controller, ControllerProps, UseFormTrigger } from "react-hook-form";
import { useTranslations } from "next-intl";
import Select, { ISelectProps } from "@/components/ui/Select";
import { IInheritanceCasesFilterFormFields } from "@/validator-schemas/inheritance-cases";

type TProps = {
  select: Partial<ISelectProps>;
  wrapper: BoxProps;
};

type TControllerProps = Omit<ControllerProps<IInheritanceCasesFilterFormFields>, "render">;

interface ISelectFormField extends TControllerProps {
  trigger: UseFormTrigger<IInheritanceCasesFilterFormFields>;
  loading?: boolean;
  props?: Partial<TProps>;
  label?: string;
}

const SelectFormField = React.forwardRef<HTMLDivElement, ISelectFormField>(({ label, ...props }, ref) => {
  const t = useTranslations();
  const selectProps = props.props?.select;
  const wrapperProps = props.props?.wrapper;
  const trigger = props.trigger;
  const loading = props.loading;

  return (
    <Controller
      {...props}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;
        return (
          <Box width="100%" display="flex" flexDirection="column" gap="10px" {...(wrapperProps || {})}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap="10px 20px" alignItems="end">
              <InputLabel sx={{ fontWeight: 600 }}>{label || "Год"}</InputLabel>
            </Box>

            <Select
              sx={{ fontWeight: 500 }}
              fullWidth
              data={selectProps?.data ?? [{}]}
              {...selectProps}
              selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
              helperText={errorMessage ? t(errorMessage) : ""}
              value={field.value == null ? "" : field.value}
              onBlur={field.onBlur}
              loading={loading}
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

SelectFormField.displayName = "SelectFormField";
export default SelectFormField;
