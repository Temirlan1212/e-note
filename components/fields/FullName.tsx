import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import Input from "@/components/ui/Input";

export interface IFullNameProps {
  form: UseFormReturn<any>;
  names: {
    lastName: string;
    firstName: string;
    middleName: string;
    code?: string;
  };
  defaultValues?: {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    code?: string;
  };
  disableFields?: boolean;
  sx?: {
    labelsSx?: SxProps<Theme>;
    inputSx?: SxProps<Theme>;
    boxSx?: SxProps<Theme>;
  };
}

export default function Address({ form, names, defaultValues, disableFields, sx }: IFullNameProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box display="flex" gap="20px" flexDirection="column" sx={sx?.boxSx}>
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.lastName}
          defaultValue={defaultValues?.lastName ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Last name")}</InputLabel>
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
          name={names.firstName}
          defaultValue={defaultValues?.firstName ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("First name")}</InputLabel>
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
          name={names.middleName}
          defaultValue={defaultValues?.middleName ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Middle name")}</InputLabel>
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
      {names?.code && (
        <Controller
          control={control}
          name={names.code}
          defaultValue={defaultValues?.code ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width={{ xs: "100%", md: "32%" }}>
              <InputLabel sx={sx?.labelsSx}>{t("Username")}</InputLabel>
              <Input
                sx={sx?.inputSx}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={true}
                {...field}
              />
            </Box>
          )}
        />
      )}
    </Box>
  );
}
