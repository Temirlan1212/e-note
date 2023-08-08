import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { InputLabel, Box } from "@mui/material";
import Autocomplete from "../ui/Autocomplete";

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

  const { trigger, control, watch, resetField } = form;

  const region = watch(names.region);
  const district = watch(names.district);
  const city = watch(names.city);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.region}
          defaultValue={defaultValues?.region ?? null}
          render={({ field, fieldState }) => {
            const { data, loading } = useFetch("/api/dictionaries/regions", "GET");

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Region")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  options={data?.status === 0 ? (data?.data as Record<string, any>[]) ?? [] : []}
                  loading={loading}
                  value={
                    field.value != null
                      ? (data?.data ?? []).find((item: Record<string, any>) => item.id == field.value.id) ?? null
                      : null
                  }
                  onBlur={field.onBlur}
                  onChange={(event, value) => {
                    field.onChange(value?.id != null ? { id: value.id } : null);
                    trigger(field.name);
                  }}
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
            const { data, loading } = useFetch(
              region != null ? `/api/dictionaries/districts?regionId=${region?.id}` : "",
              "GET"
            );

            useEffectOnce(() => {
              resetField(field.name);
            }, [region]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("District")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!region}
                  options={data?.status === 0 ? (data?.data as Record<string, any>[]) ?? [] : []}
                  loading={loading}
                  value={
                    field.value != null
                      ? (data?.data ?? []).find((item: Record<string, any>) => item.id == field.value.id) ?? null
                      : null
                  }
                  onBlur={field.onBlur}
                  onChange={(event, value) => {
                    field.onChange(value?.id != null ? { id: value.id } : null);
                    trigger(field.name);
                  }}
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
            const { data, loading } = useFetch(
              district != null ? `/api/dictionaries/cities?districtId=${district.id}` : "",
              "GET"
            );

            useEffectOnce(() => {
              resetField(field.name);
            }, [district]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("City")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!district}
                  options={data?.status === 0 ? (data?.data as Record<string, any>[]) ?? [] : []}
                  loading={loading}
                  value={
                    field.value != null
                      ? (data?.data ?? []).find((item: Record<string, any>) => item.id == field.value.id) ?? null
                      : null
                  }
                  onBlur={field.onBlur}
                  onChange={(event, value) => {
                    field.onChange(value?.id != null ? { id: value.id } : null);
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
