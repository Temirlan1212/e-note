import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { InputLabel, Box, SxProps, Theme } from "@mui/material";
import Autocomplete from "../ui/Autocomplete";
import { INotaryDistrict } from "@/models/notary-district";
import useEffectOnce from "@/hooks/useEffectOnce";

export interface IAreaProps {
  form: UseFormReturn<any>;
  names: {
    region: string;
    district: string;
    city: string;
    notaryDistrict?: string | null;
  };
  placeholders?: {
    region?: string;
    district?: string;
    city?: string;
    notaryDistrict?: string;
  };
  defaultValues?: {
    region?: { id: number } | null;
    district?: { id: number } | null;
    city?: { id: number } | null;
    notaryDistrict?: { id: number } | null;
  };
  disableFields?: boolean;
  withoutFieldBinding?: boolean;
  withNotaryDistrict?: boolean;
  getAllNotaryDistricts?: boolean;
  sx?: {
    labelsSx: SxProps<Theme>;
    inputSx: SxProps<Theme>;
  };
  skipField?: any;
}

export default function Area({
  form,
  names,
  skipField,
  placeholders,
  defaultValues,
  disableFields,
  withoutFieldBinding = false,
  withNotaryDistrict = false,
  getAllNotaryDistricts = false,
  sx,
}: IAreaProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { trigger, control, watch, resetField } = form;

  const region = watch(names.region);
  const district = watch(names.district);
  const city = watch(names.city);
  const allFields = watch();
  const isRegionalSignificance = region != null && district == null;

  const { data: regionDictionary, loading: regionDictionaryLoading } = useFetch("/api/dictionaries/regions", "GET");
  const {
    data: districtDictionary,
    loading: districtDictionaryLoading,
    update,
  } = useFetch(
    withoutFieldBinding ? (region != null ? `/api/dictionaries/districts?regionId=${region?.id}` : "") : "",
    "GET"
  );

  const { data: cityDictionary, loading: cityDictionaryLoading } = useFetch(
    withoutFieldBinding
      ? `/api/dictionaries/cities?regionId=${region?.id ?? ""}&districtId=${district?.id ?? ""}`
      : region != null
      ? `/api/dictionaries/cities?regionId=${region?.id}&districtId=${district?.id ?? ""}`
      : "",
    "GET"
  );

  const { data: notaryDistrictDictionary, loading: notaryDistrictDictionaryLoading } = useFetch(
    `/api/dictionaries/notary-districts${
      getAllNotaryDistricts
        ? ""
        : `${district ? `?districtId=${district?.id}` : ""}${
            district ? `&cityId=${city?.id}` : city ? `?cityId=${city?.id}` : ""
          }`
    }`,
    "GET"
  );

  const shouldSkipField = (fieldName: string) => {
    const { when, skip } = skipField || {};

    if (skip?.field === fieldName && when?.field && when?.id && allFields[when.field]?.id === when.id) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    update(`/api/dictionaries/districts${region ? `?regionId=${region?.id}` : ""}`);
  }, [region]);

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
              <InputLabel sx={sx?.labelsSx}>{t("Region")}</InputLabel>
              <Autocomplete
                sx={sx?.inputSx}
                disabled={skipField ? shouldSkipField(field?.name) : disableFields}
                labelField={getLabelField(regionDictionary)}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                options={regionDictionary?.status === 0 ? (regionDictionary?.data as Record<string, any>[]) ?? [] : []}
                loading={regionDictionaryLoading}
                textFieldPlaceholder={placeholders?.region ?? "---"}
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
                ref={field.ref}
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
              <InputLabel sx={sx?.labelsSx}>{t("District")}</InputLabel>
              <Autocomplete
                sx={sx?.inputSx}
                labelField={getLabelField(districtDictionary)}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={
                  skipField
                    ? shouldSkipField(field?.name)
                    : withoutFieldBinding
                    ? disableFields
                    : !region || disableFields
                }
                options={
                  districtDictionary?.status === 0 ? (districtDictionary?.data as Record<string, any>[]) ?? [] : []
                }
                textFieldPlaceholder={placeholders?.district ?? "---"}
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
                ref={field.ref}
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
                <InputLabel sx={sx?.labelsSx}>{t("City")}, Село</InputLabel>
                <Autocomplete
                  sx={sx?.inputSx}
                  labelField={getLabelField(cityDictionary)}
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={
                    skipField
                      ? shouldSkipField(field?.name)
                      : withoutFieldBinding
                      ? disableFields
                      : !region || disableFields
                  }
                  options={options ?? []}
                  textFieldPlaceholder={placeholders?.city ?? "---"}
                  loading={cityDictionaryLoading}
                  value={field.value != null ? (options ?? []).find((item) => item.id == field.value.id) ?? null : null}
                  onBlur={field.onBlur}
                  onChange={(event, value) => {
                    field.onChange(value?.id != null ? { id: value.id } : null);
                    trigger(field.name);
                  }}
                  ref={field.ref}
                />
              </Box>
            );
          }}
        />
      </Box>
      {!withNotaryDistrict ? undefined : (
        <Controller
          control={control}
          name={names.notaryDistrict as string}
          defaultValue={defaultValues?.notaryDistrict ?? null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Notary district")}</InputLabel>
              <Autocomplete
                sx={sx?.inputSx}
                labelField={getLabelField(notaryDistrictDictionary)}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={
                  skipField
                    ? shouldSkipField(field?.name)
                    : withoutFieldBinding || getAllNotaryDistricts
                    ? disableFields
                    : !district || !city || disableFields
                }
                options={
                  notaryDistrictDictionary?.status === 0
                    ? (notaryDistrictDictionary?.data as INotaryDistrict[]) ?? []
                    : []
                }
                textFieldPlaceholder={placeholders?.notaryDistrict ?? "---"}
                loading={notaryDistrictDictionaryLoading}
                value={
                  field.value != null
                    ? (notaryDistrictDictionary?.data ?? []).find(
                        (item: INotaryDistrict) => item.id == field.value?.id
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
      )}
    </Box>
  );
}
