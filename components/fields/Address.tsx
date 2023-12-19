import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import Input from "@/components/ui/Input";
import Area, { IAreaProps } from "./Area";
import { useEffect } from "react";

export interface IAddressProps extends IAreaProps {
  form: UseFormReturn<any>;
  names: {
    region: string;
    district: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
  };
  defaultValues?: {
    region?: { id: number } | null;
    district?: { id: number } | null;
    city?: { id: number } | null;
    street?: string;
    house?: string;
    apartment?: string;
  };
  disableFields?: boolean;
  boxSx?: SxProps<Theme> | undefined;
  withNotaryDistrict?: boolean;
  getAllNotaryDistricts?: boolean;
  sx?: {
    labelsSx: SxProps<Theme>;
    inputSx: SxProps<Theme>;
  };
}

export default function Address({
  form,
  names,
  defaultValues,
  disableFields,
  withNotaryDistrict,
  getAllNotaryDistricts,
  boxSx,
  sx,
}: IAddressProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  const street = watch(names.street);
  const house = watch(names.house);
  const apartment = watch(names.apartment);

  useEffect(() => {
    if (street == null) form.setValue(names?.street, "");
    if (house == null) form.setValue(names?.house, "");
    if (apartment == null) form.setValue(names?.apartment, "");
  }, [street, house, apartment]);

  return (
    <Box sx={boxSx} display="flex" gap="20px" flexDirection="column">
      <Area
        form={form}
        disableFields={disableFields}
        names={names}
        defaultValues={defaultValues}
        withNotaryDistrict={withNotaryDistrict}
        getAllNotaryDistricts={getAllNotaryDistricts}
        sx={sx}
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.street}
          defaultValue={defaultValues?.street ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Street")}</InputLabel>
              <Input
                sx={sx?.inputSx}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={disableFields}
                {...field}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.house}
          defaultValue={defaultValues?.house ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("House")}</InputLabel>
              <Input
                sx={sx?.inputSx}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={disableFields}
                {...field}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.apartment}
          defaultValue={defaultValues?.apartment ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Apartment")}</InputLabel>
              <Input
                sx={sx?.inputSx}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={disableFields}
                {...field}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
