import { InputLabel, Box } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import TelInput from "../ui/TelInput";

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
}

export default function Contact({ form, names, defaultValues }: IContactProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.email}
          defaultValue={defaultValues?.email ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("E-mail")}</InputLabel>
              <Input
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.phone}
          defaultValue={defaultValues?.phone ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Phone number")}</InputLabel>
              <TelInput
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                preferredCountries={["KG", "KZ", "AZ", "AM", "BY", "MD", "RU", "TJ", "TM", "UZ", "UA"]}
                {...field}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
