import { InputLabel, Box } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import Checkbox from "@/components/ui/Checkbox";
import Autocomplete from "@/components/ui/Autocomplete";

export interface IIdentityDocumentProps {
  form: UseFormReturn<any>;
  names: {
    documentType: string;
    documentSeries: string;
    documentNumber: string;
    organType: string;
    organNumber: string;
    issueDate: string;
    foreigner: string;
    birthDate: string;
    citizenship: string;
    nationality?: string;
    maritalStatus?: string;
    subjectRole?: string;
    familyStatus?: string;
    passportStatus?: string;
  };
  defaultValues?: {
    foreigner?: boolean | null;
    birthDate?: Date;
    citizenship?: number | null;
    nationality?: string | null;
    maritalStatus?: string;
    documentType?: number | null;
    documentSeries?: number | null;
    documentNumber?: number | null;
    organType?: string;
    organNumber?: number | null;
    issueDate?: Date;
    subjectRole?: string | null;
    familyStatus?: boolean | null;
    passportStatus?: boolean | null;
  };
  fields?: {
    nationality?: boolean;
    maritalStatus?: boolean;
  };
  disableFields?: boolean;
}

export default function IdentityDocument({
  form,
  names,
  fields,
  defaultValues,
  disableFields,
}: IIdentityDocumentProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { trigger, control, watch, resetField } = form;

  const subjectRole = watch(names.subjectRole as string);
  const isAnAdult = subjectRole === "notAnAdult";
  const isEditableCopy = watch("isToPrintLineSubTotal") as boolean;
  const documentType = watch(names.documentType);
  const foreigner = watch(names.foreigner);

  const { data: citizenshipDictionary, loading: citizenshipDictionaryLoading } = useFetch(
    `/api/dictionaries/citizenship`,
    "GET"
  );
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
      <Box display="flex" gap="20px" alignItems="center" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.birthDate}
          defaultValue={defaultValues?.birthDate ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Birth date")}</InputLabel>
              <DatePicker
                disabled={disableFields || isEditableCopy}
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
          name={names.citizenship}
          defaultValue={defaultValues?.citizenship ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Citizenship")}</InputLabel>
              <Autocomplete
                disabled={disableFields || isEditableCopy}
                labelField={locale === "ru" || locale === "kg" ? "$t:name" : "name"}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                options={
                  citizenshipDictionary?.status === 0
                    ? (citizenshipDictionary?.data as Record<string, any>[]) ?? []
                    : []
                }
                loading={citizenshipDictionaryLoading}
                value={
                  field.value != null
                    ? (citizenshipDictionary?.data ?? []).find(
                        (item: Record<string, any>) => item.id == field.value.id
                      ) ?? null
                    : null
                }
                onBlur={field.onBlur}
                onChange={(event, value) => {
                  field.onChange(value?.id != null ? { id: value.id } : null);
                  trigger(field.name);
                }}
                ref={field.ref}
              />
            </Box>
          )}
        />

        {Boolean(fields?.nationality) && Boolean(names?.nationality) && (
          <Controller
            control={control}
            name={names.nationality ?? ""}
            defaultValue={defaultValues?.nationality ?? ""}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Nationality")}</InputLabel>
                <Input
                  disabled={disableFields || isEditableCopy}
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                />
              </Box>
            )}
          />
        )}

        {Boolean(fields?.maritalStatus) && Boolean(names?.maritalStatus) && (
          <Controller
            control={control}
            name={names.maritalStatus ?? ""}
            defaultValue={defaultValues?.maritalStatus ?? ""}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Marital status")}</InputLabel>
                <Input
                  disabled={disableFields || isEditableCopy}
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                />
              </Box>
            )}
          />
        )}
      </Box>

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
              {foreigner || isAnAdult ? (
                <Input
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!documentType || disableFields}
                  {...field}
                />
              ) : (
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
              )}
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
                ref={field.ref}
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
