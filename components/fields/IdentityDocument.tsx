import { InputLabel, Box } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
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
  const locale = useLocale();

  const { trigger, control, watch, resetField } = form;

  const documentType = watch(names.documentType);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.documentType}
          defaultValue={defaultValues?.documentType ?? null}
          render={({ field, fieldState }) => {
            const { data: identityDocumentDictionary } = useFetch(`/api/dictionaries/identity-document`, "GET");

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Document")}</InputLabel>
                <Select
                  labelField={
                    identityDocumentDictionary?.data?.length > 0 &&
                    identityDocumentDictionary?.data[0][`title_${locale}`]
                      ? `title_${locale}`
                      : "title"
                  }
                  valueField="value"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  data={identityDocumentDictionary?.status === 0 ? identityDocumentDictionary?.data ?? [] : []}
                  {...field}
                  value={field.value != null ? field.value : ""}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.documentSeries}
          defaultValue={defaultValues?.documentSeries ?? null}
          render={({ field, fieldState }) => {
            const { data: identityDocumentSeriesDictionary } = useFetch(
              `/api/dictionaries/identity-document/series`,
              "GET"
            );

            useEffectOnce(() => {
              resetField(field.name);
            }, [documentType]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Series")}</InputLabel>
                <Select
                  labelField={
                    identityDocumentSeriesDictionary?.data?.length > 0 &&
                    identityDocumentSeriesDictionary?.data[0][`title_${locale}`]
                      ? `title_${locale}`
                      : "title"
                  }
                  valueField="value"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!documentType}
                  data={
                    identityDocumentSeriesDictionary?.status === 0 ? identityDocumentSeriesDictionary?.data ?? [] : []
                  }
                  {...field}
                  value={field.value != null ? field.value : ""}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.documentNumber}
          defaultValue={defaultValues?.documentNumber ?? ""}
          render={({ field, fieldState }) => {
            useEffectOnce(() => {
              resetField(field.name);
            }, [documentType]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Number")}</InputLabel>
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!documentType}
                  {...field}
                />
              </Box>
            );
          }}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.organType}
          defaultValue={defaultValues?.organType ?? ""}
          render={({ field, fieldState }) => {
            useEffectOnce(() => {
              resetField(field.name);
            }, [documentType]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Organ")}</InputLabel>
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!documentType}
                  {...field}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.organNumber}
          defaultValue={defaultValues?.organNumber ?? ""}
          render={({ field, fieldState }) => {
            useEffectOnce(() => {
              resetField(field.name);
            }, [documentType]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Number")}</InputLabel>
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!documentType}
                  {...field}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.issueDate}
          defaultValue={defaultValues?.issueDate ?? null}
          render={({ field, fieldState }) => {
            useEffectOnce(() => {
              resetField(field.name);
            }, [documentType]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Date of issue")}</InputLabel>
                <DatePicker
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!documentType}
                  value={field.value != null ? new Date(field.value) : null}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                />
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
}
