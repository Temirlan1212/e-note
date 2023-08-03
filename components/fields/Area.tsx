import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { InputLabel, Box } from "@mui/material";
import Select from "@/components/ui/Select";

export interface IAreaProps {
  form: UseFormReturn<any>;
  names: {
    region: string;
    district: string;
    city: string;
  };
  defaultValues?: {
    region?: number | null;
    district?: number | null;
    city?: number | null;
  };
}

export default function Area({ form, names, defaultValues }: IAreaProps) {
  const t = useTranslations();

  const { control, watch, resetField } = form;

  const regionId = watch(names.region);
  const districtId = watch(names.district);
  const cityId = watch(names.city);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.region}
          defaultValue={defaultValues?.region ?? null}
          render={({ field, fieldState }) => {
            const { data: regionsDictionary } = useFetch("/api/dictionaries/regions", "GET");

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Region")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  data={regionsDictionary?.status === 0 ? regionsDictionary?.data ?? [] : []}
                  {...field}
                  value={field.value != null ? field.value : ""}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.district}
          defaultValue={defaultValues?.district ?? null}
          render={({ field, fieldState }) => {
            const { data: districtsDictionary } = useFetch(`/api/dictionaries/districts?regionId=${regionId}`, "GET");

            useEffectOnce(() => {
              resetField(field.name);
            }, [regionId]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("District")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!regionId}
                  data={districtsDictionary?.status === 0 ? districtsDictionary?.data ?? [] : []}
                  {...field}
                  value={field.value != null ? field.value : ""}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name={names.city}
          defaultValue={defaultValues?.city ?? null}
          render={({ field, fieldState }) => {
            const { data: citiesDictionary } = useFetch(`/api/dictionaries/cities?districtId=${districtId}`, "GET");

            useEffectOnce(() => {
              resetField(field.name);
            }, [districtId]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("City")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!districtId}
                  data={citiesDictionary?.status === 0 ? citiesDictionary?.data ?? [] : []}
                  {...field}
                  value={field.value != null ? field.value : ""}
                />
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
}
