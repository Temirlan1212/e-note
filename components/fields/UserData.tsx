import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { InputLabel, Box } from "@mui/material";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { MouseEventHandler } from "react";

export interface IPersonalDataProps {
  form: UseFormReturn<any>;
  names: {
    type: string;
    foreigner: string;
    lastName: string;
    firstName: string;
    middleName: string;
    pin: string;
  };
  defaultValues?: {
    type?: number | null;
    foreigner?: boolean;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    pin?: number;
  };
  fields?: {
    foreigner?: boolean;
    lastName?: boolean;
    firstName?: boolean;
    middleName?: boolean;
    pin?: boolean;
  };
  onPinCheck?: MouseEventHandler<HTMLButtonElement>;
}

export default function UserData({ form, names, defaultValues, fields, onPinCheck }: IPersonalDataProps) {
  const t = useTranslations();

  const { control, watch } = form;

  const foreigner = watch(names.foreigner);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.foreigner == null || !!fields?.foreigner) && (
          <Controller
            control={control}
            name={names.foreigner}
            defaultValue={defaultValues?.foreigner ?? false}
            render={({ field, fieldState }) => (
              <Checkbox
                label={t("Foreign person")}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
                checked={!!field.value}
              />
            )}
          />
        )}
      </Box>

      <Box display="flex" gap="20px" alignItems="center" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.pin == null || !!fields?.pin) && (
          <>
            <Controller
              control={control}
              name={names.pin}
              defaultValue={defaultValues?.pin ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%" height="90px">
                  <InputLabel>{t("PIN")}</InputLabel>
                  <Input
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message, { min: 6 }) : ""}
                    {...field}
                    value={field.value != null ? field.value : ""}
                  />
                </Box>
              )}
            />

            {onPinCheck && !foreigner && (
              <Button
                endIcon={<ContentPasteSearchIcon />}
                sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
                onClick={onPinCheck}
              >
                {t("Check")}
              </Button>
            )}
          </>
        )}
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.lastName == null || !!fields?.lastName) && (
          <Controller
            control={control}
            name={names.lastName}
            defaultValue={defaultValues?.lastName ?? ""}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Last name")}</InputLabel>
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                />
              </Box>
            )}
          />
        )}

        {(fields?.firstName == null || !!fields?.firstName) && (
          <Controller
            control={control}
            name={names.firstName}
            defaultValue={defaultValues?.firstName ?? ""}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("First name")}</InputLabel>
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                />
              </Box>
            )}
          />
        )}

        {(fields?.middleName == null || !!fields?.middleName) && (
          <Controller
            control={control}
            name={names.middleName}
            defaultValue={defaultValues?.middleName ?? ""}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Middle name")}</InputLabel>
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                />
              </Box>
            )}
          />
        )}
      </Box>
    </Box>
  );
}
