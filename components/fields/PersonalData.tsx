import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { InputLabel, Box } from "@mui/material";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import Autocomplete from "../ui/Autocomplete";

export interface IPersonalDataProps {
  form: UseFormReturn<any>;
  names: {
    type: string;
    foreigner: string;
    lastName: string;
    firstName: string;
    middleName: string;
    pin: string;
    birthDate: string;
    citizenship: string;
  };
  defaultValues?: {
    type?: number | null;
    foreigner?: boolean;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    pin?: number;
    birthDate?: Date;
    citizenship?: number | null;
  };
  fields?: {
    type?: boolean;
    foreigner?: boolean;
    lastName?: boolean;
    firstName?: boolean;
    middleName?: boolean;
    pin?: boolean;
    birthDate?: boolean;
    citizenship?: boolean;
  };
}

export default function PersonalData({ form, names, defaultValues, fields }: IPersonalDataProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  const { data: citizenshipDictionary, loading: citizenshipDictionaryLoading } = useFetch(
    `/api/dictionaries/citizenship`,
    "GET"
  );

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.type == null || !!fields?.type) && (
          <Controller
            control={control}
            name={names.type}
            defaultValue={defaultValues?.type ?? 2}
            render={({ field, fieldState }) => (
              <Radio
                labelField="name"
                valueField="id"
                row
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                data={[
                  { id: 2, name: t("Individual person") },
                  { id: 1, name: t("Juridical person") },
                ]}
                {...field}
                value={field.value != null ? field.value : ""}
              />
            )}
          />
        )}
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

      {(fields?.pin == null || !!fields?.pin) && (
        <Controller
          control={control}
          name={names.pin}
          defaultValue={defaultValues?.pin ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("PIN")}</InputLabel>
              <Input
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
                value={field.value != null ? field.value : ""}
              />
            </Box>
          )}
        />
      )}

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.birthDate == null || !!fields?.birthDate) && (
          <Controller
            control={control}
            name={names.birthDate}
            defaultValue={defaultValues?.birthDate ?? null}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Birth date")}</InputLabel>
                <DatePicker
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  value={field.value != null ? new Date(field.value) : null}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                />
              </Box>
            )}
          />
        )}
        {(fields?.citizenship == null || !!fields?.citizenship) && (
          <Controller
            control={control}
            name={names.citizenship}
            defaultValue={defaultValues?.citizenship ?? null}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Citizenship")}</InputLabel>
                <Autocomplete
                  labelField="name"
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
                />
              </Box>
            )}
          />
        )}
      </Box>
    </Box>
  );
}
