import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { InputLabel, Box } from "@mui/material";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";

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
}

export default function PersonalData({ form, names, defaultValues }: IPersonalDataProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
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
                { id: 2, name: "Физическое лицо" },
                { id: 1, name: "Юридическое лицо" },
              ]}
              {...field}
              value={field.value != null ? field.value : ""}
            />
          )}
        />
        <Controller
          control={control}
          name={names.foreigner}
          defaultValue={defaultValues?.foreigner ?? false}
          render={({ field, fieldState }) => (
            <Checkbox
              label="Иностранное лицо"
              type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
              helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              {...field}
            />
          )}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
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
      </Box>

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

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
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
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.citizenship}
          defaultValue={defaultValues?.citizenship ?? null}
          render={({ field, fieldState }) => {
            const { data: citizenshipDictionary } = useFetch(`/api/dictionaries/citizenship`, "GET");

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Citizenship")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  data={citizenshipDictionary?.status === 0 ? citizenshipDictionary?.data ?? [] : []}
                  {...field}
                  value={field.value != null ? field.value : ""}
                ></Select>
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
}
