import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import Input from "@/components/ui/Input";
import Area, { IAreaProps } from "./Area";

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
  getNotaryDistrict?: boolean;
}

export default function Address({
  form,
  names,
  defaultValues,
  disableFields,
  getNotaryDistrict,
  boxSx,
}: IAddressProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box sx={boxSx} display="flex" gap="20px" flexDirection="column">
      <Area
        form={form}
        disableFields={disableFields}
        names={names}
        defaultValues={defaultValues}
        getNotaryDistrict={getNotaryDistrict}
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.street}
          defaultValue={defaultValues?.street ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Street")}</InputLabel>
              <Input
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
              <InputLabel>{t("House")}</InputLabel>
              <Input
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
              <InputLabel>{t("Apartment")}</InputLabel>
              <Input
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
