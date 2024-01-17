import { Box, BoxProps, InputLabel } from "@mui/material";
import React from "react";
import { Controller, ControllerProps, UseFormTrigger } from "react-hook-form";
import { useTranslations } from "next-intl";
import Select, { ISelectProps } from "@/components/ui/Select";
import { IInheritanceCasesFilterForm } from "@/validator-schemas/inheritance-cases";

type TProps = {
  select: Partial<ISelectProps>;
  wrapper: BoxProps;
};

type TControllerProps = Omit<ControllerProps<IInheritanceCasesFilterForm>, "render">;

interface ISelectFormField extends TControllerProps {
  trigger: UseFormTrigger<IInheritanceCasesFilterForm>;
  loading?: boolean;
  props?: Partial<TProps>;
}

const SelectFormField = React.forwardRef<HTMLDivElement, ISelectFormField>(({ ...props }, ref) => {
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
              <InputLabel sx={{ fontWeight: 600 }}>{t("Objects of civil rights")}</InputLabel>
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
