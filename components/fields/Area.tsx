import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
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
    region?: { id: number } | null;
    district?: { id: number } | null;
    city?: { id: number } | null;
  };
  disableFields?: boolean;
}

export default function Area({ form, names, defaultValues, disableFields }: IAreaProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { trigger, control, watch, resetField } = form;

  const region = watch(names.region);
  const district = watch(names.district);
  const isRegionalSignificance = region != null && district == null;

  const { data: regionDictionary, loading: regionDictionaryLoading } = useFetch("/api/dictionaries/regions", "GET");
  const { data: districtDictionary, loading: districtDictionaryLoading } = useFetch(
    region != null ? `/api/dictionaries/districts?regionId=${region.id}` : "",
    "GET"
  );
  const { data: cityDictionary, loading: cityDictionaryLoading } = useFetch(
    region != null ? `/api/dictionaries/cities?regionId=${region.id}&districtId=${district?.id ?? ""}` : "",
    "GET"
  );

  const getLabelField = (data: FetchResponseBody | null) => {
    if ((locale === "ru" || locale === "kg") && data?.status === 0 && Array.isArray(data?.data)) {
      const item = data.data.find((item) => item.hasOwnProperty("$t:name"));
      return item != null ? "$t:name" : "name";
    }
    return "name";
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.region}
          defaultValue={defaultValues?.region ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Region")}</InputLabel>
              <Autocomplete
                disabled={disableFields}
                labelField={getLabelField(regionDictionary)}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                options={regionDictionary?.status === 0 ? (regionDictionary?.data as Record<string, any>[]) ?? [] : []}
                loading={regionDictionaryLoading}
                value={
                  field.value != null
                    ? (regionDictionary?.data ?? []).find((item: Record<string, any>) => item.id == field.value.id) ??
                      null
                    : null
                }
                onBlur={field.onBlur}
                onChange={(event, value) => {
                  field.onChange(value?.id != null ? { id: value.id } : null);
                  trigger(field.name);
                  [names.district, names.city].map((item) => resetField(item, { defaultValue: null }));
                }}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.district}
          defaultValue={defaultValues?.district ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("District")}</InputLabel>
              <Autocomplete
                labelField={getLabelField(districtDictionary)}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={!region || disableFields}
                options={
                  districtDictionary?.status === 0 ? (districtDictionary?.data as Record<string, any>[]) ?? [] : []
                }
                loading={districtDictionaryLoading}
                value={
                  field.value != null
                    ? (districtDictionary?.data ?? []).find((item: Record<string, any>) => item.id == field.value.id) ??
                      null
                    : null
                }
                onBlur={field.onBlur}
                onChange={(event, value) => {
                  field.onChange(value?.id != null ? { id: value.id } : null);
                  trigger(field.name);
                  [names.city].map((item) => resetField(item, { defaultValue: null }));
                }}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.city}
          defaultValue={defaultValues?.city ?? null}
          render={({ field, fieldState }) => {
            const options: Record<string, any>[] = isRegionalSignificance
              ? cityDictionary?.data?.filter((item: Record<string, any>) => Boolean(item?.isRegionalSignificance))
              : cityDictionary?.data;

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("City")}, Село</InputLabel>
                <Autocomplete
                  labelField={getLabelField(cityDictionary)}
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!region || disableFields}
                  options={options ?? []}
                  loading={cityDictionaryLoading}
                  value={field.value != null ? (options ?? []).find((item) => item.id == field.value.id) ?? null : null}
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
