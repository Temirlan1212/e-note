import { InputLabel, Box } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";

export interface IHeir {
  keyWord?: string;
  birthDate?: Date | string;
  deathDate?: Date | string;
}

export interface IHeirSearchFormProps {
  form: UseFormReturn<any>;
  names: {
    keyWord: string;
    birthDate: string;
    deathDate: string;
  };
  defaultValues?: {
    keyWord?: string;
    birthDate?: Date | string;
    deathDate?: Date | string;
  };
  disableFields?: boolean;
  onSubmit?: any;
}

export default function SearchForm({ form, names, defaultValues, disableFields, onSubmit }: IHeirSearchFormProps) {
  const t = useTranslations();

  const { trigger, control } = form;

  return (
    <Box sx={{ marginTop: "50px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: {
            xs: "30px",
            md: "40px",
          },
        }}
      >
        <Controller
          control={control}
          name={names.keyWord}
          defaultValue={defaultValues?.keyWord ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={{ fontWeight: 600 }}>{t("Full name of the testator (required)")}</InputLabel>
              <Input
                sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                placeholder={t("Enter your full name")}
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
          name={names.birthDate}
          defaultValue={defaultValues?.birthDate ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={{ fontWeight: 600 }}>{t("Birth date")}</InputLabel>
              <DatePicker
                sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                disabled={disableFields}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                value={field.value != null ? new Date(field.value) : null}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
                ref={field.ref}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.deathDate}
          defaultValue={defaultValues?.deathDate ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={{ fontWeight: 600 }}>{t("Date of death")}</InputLabel>
              <DatePicker
                sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                disabled={disableFields}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                value={field.value != null ? new Date(field.value) : null}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
                ref={field.ref}
              />
            </Box>
          )}
        />

        <Button
          startIcon={<SearchOutlined />}
          sx={{ width: "100%", height: "43px" }}
          onClick={form.handleSubmit(onSubmit)}
        >
          {t("SearchHeir")}
        </Button>
      </Box>
    </Box>
  );
}
