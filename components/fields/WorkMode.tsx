import { Box } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Checkbox from "@/components/ui/Checkbox";

export interface IWorkModeProps {
  form: UseFormReturn<any>;
  names?: {
    roundClock?: string;
    departure?: string;
  };
  defaultValues?: {
    roundClock?: boolean | null;
    departure?: boolean | null;
  };
  disableFields?: boolean;
}

export default function Contact({ form, names, defaultValues, disableFields }: IWorkModeProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
      {Boolean(names?.roundClock) && (
        <Controller
          control={control}
          name={names?.roundClock ?? ""}
          defaultValue={defaultValues?.roundClock ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Checkbox
                label={t("Around the clock")}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
                checked={!!field.value}
                disabled={disableFields}
              />
            </Box>
          )}
        />
      )}

      {Boolean(names?.departure) && (
        <Controller
          control={control}
          name={names?.departure ?? ""}
          defaultValue={defaultValues?.departure ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Checkbox
                label={t("Visiting")}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
                checked={!!field.value}
                disabled={disableFields}
              />
            </Box>
          )}
        />
      )}
    </Box>
  );
}
