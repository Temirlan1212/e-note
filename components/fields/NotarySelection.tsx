import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { INotaryDistrict } from "@/models/notary-district";
import { ICompany } from "@/models/company";
import { Badge, Box, IconButton, InputLabel, Menu } from "@mui/material";
import Autocomplete from "@/components/ui/Autocomplete";
import Area from "@/components/fields/Area";
import useNotariesStore from "@/stores/notaries";
import { useProfileStore } from "@/stores/profile";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

export interface NotarySelectionProps {
  form: UseFormReturn<any>;
}

export default function NotarySelection({ form }: NotarySelectionProps) {
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const [notaryData, setNotaryData] = useNotariesStore((state) => [state.notaryData, state.setNotaryData]);
  const profile = useProfileStore.getState();
  const t = useTranslations();
  const locale = useLocale();

  const {
    trigger,
    control,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = form;

  const city = watch("city");
  const notaryDistrict = watch("notaryDistrict");
  const region = watch("region");
  const district = watch("district");

  const [loading, setLoading] = useState(false);

  const { data: notaryDistrictDictionary, loading: notaryDistrictDictionaryLoading, update } = useFetch("", "GET");

  const { data: companyDictionary, loading: companyDictionaryLoading } = useFetch(
    `/api/companies?notaryDistrictId=${notaryDistrict?.id ?? ""}&regionId=${region?.id ?? ""}&districtId=${
      district?.id ?? ""
    }&cityId=${city?.id ?? ""}`,
    "POST"
  );

  useEffect(() => {
    update(
      `/api/dictionaries/notary-districts${district ? `?districtId=${district?.id}` : ""}${
        district ? `&cityId=${city?.id}` : city ? `?cityId=${city?.id}` : ""
      }`
    );
  }, [city, district]);

  useEffectOnce(() => {
    resetField("notaryDistrict", { defaultValue: null });
  }, [city]);

  const getLabelField = (data: FetchResponseBody | null) => {
    if ((locale === "ru" || locale === "kg") && data?.status === 0 && Array.isArray(data?.data)) {
      const item = data.data.find((item) => item.hasOwnProperty("$t:name") || item.hasOwnProperty("partner.fullName"));
      return item != null ? (item.hasOwnProperty("partner.fullName") ? "partner.fullName" : "$t:name") : "name";
    }
    return "name";
  };

  useEffectOnce(() => {
    if (notaryData != null && profile.user != null) {
      if (!notaryData?.id) return;
      setValue("company", { id: notaryData.id });
      setNotaryData(null);
    }
  }, [notaryData]);

  const handlePopupToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(menu == null ? event.currentTarget : null);
  };

  const getBadgeCount = (values: string[]) => {
    return values.filter((value) => !!value).length;
  };

  const isActiveBadge = getBadgeCount([city, notaryDistrict, region, district]) > 0 || !!menu;

  return (
    <Box display="flex" gap="20px" flexDirection="column" position="relative">
      <Controller
        control={control}
        name="company"
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Box display="flex" flexDirection="column" width="100%">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <InputLabel sx={{ fontWeight: 600 }}>{t("Notary")}</InputLabel>
              <IconButton color={isActiveBadge ? "success" : "secondary"}>
                <Badge
                  onClick={handlePopupToggle}
                  badgeContent={getBadgeCount([city, notaryDistrict, region, district])}
                  sx={{
                    "& .MuiBadge-badge": {
                      border: "1px solid",
                      background: "#fff",
                    },
                  }}
                  max={9}
                >
                  {isActiveBadge ? <FilterAltIcon /> : <FilterAltOutlinedIcon />}
                </Badge>
              </IconButton>
            </Box>

            <Autocomplete
              sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
              labelField={getLabelField(companyDictionary)}
              type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
              helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              disabled={loading}
              options={companyDictionary?.status === 0 ? (companyDictionary?.data as ICompany[]) ?? [] : []}
              loading={companyDictionaryLoading}
              value={
                field.value != null
                  ? (companyDictionary?.data ?? []).find((item: ICompany) => item.id == field.value?.id) ?? null
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

      <Menu anchorEl={menu} open={!!menu} onClose={handlePopupToggle}>
        <Box
          display="flex"
          flexDirection="column"
          gap="30px"
          padding="20px"
          sx={{ width: { xs: "100%", sm: "400px", md: "600px" } }}
        >
          <Area
            placeholders={{
              region: t("All regions"),
              district: t("All districts"),
              city: t("All cities and villages"),
            }}
            sx={{
              boxSx: { display: "flex", flexDirection: "column" },
              labelsSx: { fontWeight: 600 },
              inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
            }}
            withoutFieldBinding={true}
            form={form}
            names={{ region: "region", district: "district", city: "city" }}
          />

          <Controller
            control={control}
            name="notaryDistrict"
            defaultValue={null}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel sx={{ fontWeight: 600 }}>{t("Notary district")}</InputLabel>
                <Autocomplete
                  sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                  labelField={getLabelField(notaryDistrictDictionary)}
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  options={
                    notaryDistrictDictionary?.status === 0
                      ? (notaryDistrictDictionary?.data as INotaryDistrict[]) ?? []
                      : []
                  }
                  textFieldPlaceholder={t("All notary districts")}
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
                    resetField("company", { defaultValue: null });
                  }}
                  ref={field.ref}
                />
              </Box>
            )}
          />
        </Box>
      </Menu>
    </Box>
  );
}
