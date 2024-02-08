import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import Input from "@/components/ui/Input";

export interface ILicenseProps {
  form: UseFormReturn<any>;
  names: {
    licenseNo: string;
    licenseStatus: string;
    licenseTermFrom: string;
    licenseTermUntil: string;
  };
  defaultValues?: {
    licenseNo: string;
    licenseStatus: string;
    licenseTermFrom: string;
    licenseTermUntil: string;
  };
  disableFields?: boolean;
  sx?: {
    labelsSx?: SxProps<Theme>;
    inputSx?: SxProps<Theme>;
    boxSx?: SxProps<Theme>;
  };
}

export default function License({ form, names, defaultValues, disableFields, sx }: ILicenseProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box display="flex" gap="20px" flexDirection="column" width="100%">
      <Box display="flex" flexWrap="wrap" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.licenseNo}
          defaultValue={defaultValues?.licenseNo ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("License number")}</InputLabel>
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
          name={names.licenseStatus}
          defaultValue={defaultValues?.licenseStatus ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("License status")}</InputLabel>
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
          name={names.licenseTermFrom}
          defaultValue={defaultValues?.licenseTermFrom ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("License start date")}</InputLabel>
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
          name={names.licenseTermUntil}
          defaultValue={defaultValues?.licenseTermUntil ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("License end date")}</InputLabel>
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
