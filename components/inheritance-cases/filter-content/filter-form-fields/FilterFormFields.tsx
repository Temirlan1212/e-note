import { Box, BoxProps } from "@mui/material";
import React from "react";
import Input from "../../../ui/Input";
import { UseFormReturn } from "react-hook-form";
import { IInheritanceCasesFilterForm } from "@/validator-schemas/inheritance-cases";
import { useTranslations } from "next-intl";
import SelectFormField from "./SelectFormField";

const FilterFormFields = React.forwardRef<
  HTMLDivElement,
  BoxProps & { form: UseFormReturn<IInheritanceCasesFilterForm> }
>(({ className, form, ...props }, ref) => {
  const t = useTranslations();
  const errors = form.formState.errors;
  const control = form.control;
  const trigger = form.trigger;

  return (
    <Box ref={ref} display="flex" flexDirection="column" gap="10px" {...props}>
      <Box display="flex" gap="15px" marginTop="10px" flexDirection={{ xs: "column", md: "row" }}>
        <Input
          label={"Номер наследст. дела"}
          variant="outlined"
          color="success"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors?.inheritanceCaseNumber?.message ?? false}
          helperText={errors?.inheritanceCaseNumber?.message && t(errors?.inheritanceCaseNumber?.message)}
          register={form.register}
          name="inheritanceCaseNumber"
        />

        <Input
          label={"ПИН умершего"}
          variant="outlined"
          color="success"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors?.pin?.message ?? false}
          helperText={errors?.pin?.message && t(errors?.pin?.message)}
          register={form.register}
          name="pin"
        />

        <Input
          label={"ФИО умершего"}
          variant="outlined"
          color="success"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors?.fullName?.message ?? false}
          helperText={errors?.fullName?.message && t(errors?.fullName?.message)}
          register={form.register}
          name="fullName"
        />

        <Input
          label={"Дата смерти"}
          variant="outlined"
          color="success"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors?.dateOfDeath?.message ?? false}
          helperText={errors?.dateOfDeath?.message && t(errors?.dateOfDeath?.message)}
          register={form.register}
          name="dateOfDeath"
        />
      </Box>

      <Box width="100%" display="flex" justifyContent="flex-end">
        <SelectFormField
          control={control}
          name="year"
          defaultValue=""
          trigger={trigger}
          props={{
            select: { data: [{ label: "2022", value: 2022 }], sx: { width: "auto" } },
            wrapper: { width: "fit-content" },
          }}
        />
      </Box>
    </Box>
  );
});

FilterFormFields.displayName = "FilterFormFields";
export default FilterFormFields;
