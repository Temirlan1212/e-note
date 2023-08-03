import { InputLabel, Box } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";

export interface IIdentityDocumentProps {
  form: UseFormReturn<any>;
  names: {
    documentType: string;
    documentSeries: string;
    documentNumber: string;
    organType: string;
    organNumber: string;
    issueDate: string;
  };
  defaultValues?: {
    documentType?: number | null;
    documentSeries?: number | null;
    documentNumber?: number | null;
    organType?: string;
    organNumber?: number | null;
    issueDate?: Date;
  };
}

export default function IdentityDocument({ form, names, defaultValues }: IIdentityDocumentProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Controller
        control={control}
        name={names.documentType}
        defaultValue={defaultValues?.documentType ?? null}
        render={({ field, fieldState }) => (
          <Box display="flex" flexDirection="column" width="100%">
            <InputLabel>{t("Document")}</InputLabel>
            <Select
              labelField="name"
              valueField="id"
              data={[]}
              selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
              helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
            />
          </Box>
        )}
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.documentSeries}
          defaultValue={defaultValues?.documentSeries ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Series")}</InputLabel>
              <Select
                labelField="name"
                valueField="id"
                data={[]}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.documentNumber}
          defaultValue={defaultValues?.documentNumber ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Number")}</InputLabel>
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
          name={names.organType}
          defaultValue={defaultValues?.organType ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Organ")}</InputLabel>
              <Select
                labelField="name"
                valueField="id"
                data={[]}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.organNumber}
          defaultValue={defaultValues?.organNumber ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Number")}</InputLabel>
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
          name={names.issueDate}
          defaultValue={defaultValues?.issueDate ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Date of issue")}</InputLabel>
              <DatePicker {...field} />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
