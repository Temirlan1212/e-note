import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";

export interface ICoordinatesProps {
  form: UseFormReturn<any>;
  names: {
    latitude: string;
    longitude: string;
  };
  defaultValues?: {
    latitude?: string;
    longitude?: string;
  };
  disableFields?: boolean;
  boxSx?: SxProps<Theme> | undefined;
}

export default function Coordinates({ form, names, defaultValues, disableFields, boxSx }: ICoordinatesProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box sx={boxSx} display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.latitude}
          defaultValue={defaultValues?.latitude ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Latitude")}</InputLabel>
              <Input
                disabled={disableFields}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.longitude}
          defaultValue={defaultValues?.longitude ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Longitude")}</InputLabel>
              <Input
                disabled={disableFields}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
