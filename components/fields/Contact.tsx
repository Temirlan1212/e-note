import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import TelInput from "../ui/TelInput";
import { useEffect } from "react";

export interface IContactProps {
  form: UseFormReturn<any>;
  names: {
    email: string;
    phone: string;
  };
  defaultValues?: {
    email?: string;
    phone?: string;
  };
  disableFields?: boolean;
  boxSx?: SxProps<Theme> | undefined;
}

export default function Contact({ form, names, defaultValues, disableFields, boxSx }: IContactProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  const email = watch(names.email);

  useEffect(() => {
    if (email == null) form.setValue(names.email, "");
  }, [email]);

  return (
    <Box sx={boxSx} display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.phone}
          defaultValue={defaultValues?.phone ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Phone number")}</InputLabel>
              <TelInput
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
          name={names.email}
          defaultValue={defaultValues?.email ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("E-mail")}</InputLabel>
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
