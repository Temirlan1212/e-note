import { InputLabel, Box } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import Checkbox from "@/components/ui/Checkbox";

export interface IIdentityDocumentProps {
  form: UseFormReturn<any>;
  names: {
    documentType: string;
    documentSeries: string;
    documentNumber: string;
    organType: string;
    organNumber: string;
    issueDate: string;
    familyStatus?: string;
    passportStatus?: string;
  };
  defaultValues?: {
    documentType?: number | null;
    documentSeries?: number | null;
    documentNumber?: number | null;
    organType?: string;
    organNumber?: number | null;
    issueDate?: Date;
    familyStatus?: boolean | null;
    passportStatus?: boolean | null;
  };
  disableFields?: boolean;
}

export default function IdentityDocument({ form, names, defaultValues, disableFields }: IIdentityDocumentProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { trigger, control, watch, resetField } = form;

  const documentType = watch(names.documentType);

  const { data: identityDocumentDictionary, loading: identityDocumentDictionaryLoading } = useFetch(
    `/api/dictionaries/identity-document`,
    "GET"
  );
  const { data: identityDocumentSeriesDictionary, loading: identityDocumentSeriesDictionaryLoading } = useFetch(
    `/api/dictionaries/identity-document/series`,
    "GET"
  );

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.documentType}
          defaultValue={defaultValues?.documentType ?? null}
          render={({ field, fieldState }) => {
            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Document")}</InputLabel>
                <Select
                  disabled={disableFields}
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
                  loading={identityDocumentDictionaryLoading}
                  {...field}
                  value={field.value != null ? field.value : ""}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                    [
                      names.documentSeries,
                      names.documentNumber,
                      names.organType,
                      names.organNumber,
                      names.issueDate,
                    ].map((item) => resetField(item));
                  }}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.documentSeries}
          defaultValue={defaultValues?.documentSeries ?? null}
          render={({ field, fieldState }) => (
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
                disabled={!documentType || disableFields}
                data={
                  identityDocumentSeriesDictionary?.status === 0 ? identityDocumentSeriesDictionary?.data ?? [] : []
                }
                loading={identityDocumentSeriesDictionaryLoading}
                {...field}
                value={field.value != null ? field.value : ""}
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
                disabled={!documentType || disableFields}
                {...field}
              />
            </Box>
          )}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.organType}
          defaultValue={defaultValues?.organType ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Organ")}</InputLabel>
              <Input
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={!documentType || disableFields}
                {...field}
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
              <InputLabel>{t("Organ number")}</InputLabel>
              <Input
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={!documentType || disableFields}
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
              <DatePicker
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={!documentType || disableFields}
                value={field.value != null ? new Date(field.value) : null}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
              />
            </Box>
          )}
        />

        {Boolean(names?.passportStatus) && (
          <Controller
            control={control}
            name={names.passportStatus ?? ""}
            defaultValue={defaultValues?.passportStatus ?? false}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" justifyContent="center">
                <InputLabel>{t("Validity status")}</InputLabel>

                <Checkbox
                  label={field.value ? t("Valid") : t("Invalid")}
                  disabled={disableFields}
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                  checked={!!field.value}
                />
              </Box>
            )}
          />
        )}
      </Box>
    </Box>
  );
}
