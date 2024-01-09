import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { format } from "date-fns";
import { IApplicationSchema } from "@/validator-schemas/application";
import { INotaryDistrict } from "@/models/notary-district";
import { ICompany } from "@/models/company";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import Autocomplete from "@/components/ui/Autocomplete";
import Area from "@/components/fields/Area";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StepperContentStep from "@/components/ui/StepperContentStep";
import useNotariesStore from "@/stores/notaries";
import { useProfileStore } from "@/stores/profile";
import ExpandingFields from "@/components/fields/ExpandingFields";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

const fields = ["region", "district", "city", "notaryDistrict", "company"] as const;

export default function FirstStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const [notaryData, setNotaryData] = useNotariesStore((state) => [state.notaryData, state.setNotaryData]);
  const [filteredCompanyDictionary, setFilteredCompanyDictionary] = useState<FetchResponseBody | null>(null);
  const profile = useProfileStore.getState();
  const t = useTranslations();
  const locale = useLocale();

  const {
    trigger,
    control,
    watch,
    resetField,
    getValues,
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

  const { update: applicationCreate } = useFetch("", "POST");
  const { update: applicationUpdate } = useFetch("", "PUT");

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

  const focusToFieldOnError = () => {
    for (let i = 0; i < fields.length; i++) {
      if (errors != null && errors?.[fields[i]]) {
        form.setFocus(fields[i]);
        break;
      }
    }
  };

  const triggerFields = async () => {
    return await trigger(fields);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();
    if (!validated) focusToFieldOnError();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> & { creationDate: string } = {
        company: values.company,
        creationDate: format(new Date(), "yyyy-MM-dd"),
        statusSelect: 2,
        notarySignatureStatus: 2,
      };

      let result = null;
      if (values.id != null) {
        data.id = values.id;
        data.version = values.version;
        result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      } else {
        result = await applicationCreate("/api/applications/create", data);
      }

      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
        if (onNext != null) onNext({ step: targetStep });
      }

      setLoading(false);
    }
  };

  const getLabelField = (data: FetchResponseBody | null) => {
    if ((locale === "ru" || locale === "kg") && data?.status === 0 && Array.isArray(data?.data)) {
      const item = data.data.find((item) => item.hasOwnProperty("$t:name") || item.hasOwnProperty("partner.fullName"));
      return item != null ? (item.hasOwnProperty("partner.fullName") ? "partner.fullName" : "$t:name") : "name";
    }
    return "name";
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  useEffectOnce(() => {
    if (notaryData != null && profile.user != null) {
      if (!notaryData?.id) return;
      setValue("company", { id: notaryData.id });
      setNotaryData(null);
    }
  }, [notaryData]);

  useEffectOnce(() => {
    if (companyDictionary) {
      const currentDay = new Date();

      const filteredCompanies = {
        ...companyDictionary,
        data: Array.isArray(companyDictionary?.data)
          ? (companyDictionary?.data as any[]).filter((company) => {
              const licenseTermUntil = new Date(company?.licenseTermUntil);
              return licenseTermUntil > currentDay;
            })
          : [],
      };

      setFilteredCompanyDictionary(filteredCompanies);
    }
  }, [companyDictionary]);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <StepperContentStep step={1} title={t("Choose notary")} sx={{ flex: "1 1 100%" }} />
        <Hint type="hint">{t("Form first step hint text")}</Hint>
      </Box>

      <Controller
        control={control}
        name="company"
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Box display="flex" flexDirection="column" width="100%">
            <InputLabel sx={{ fontWeight: 600 }}>{t("Notary")}</InputLabel>
            <Autocomplete
              sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
              labelField={getLabelField(filteredCompanyDictionary)}
              type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
              helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              disabled={loading}
              options={
                filteredCompanyDictionary?.status === 0 ? (filteredCompanyDictionary?.data as ICompany[]) ?? [] : []
              }
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

      <ExpandingFields title="Additional information">
        <Box display="flex" flexDirection="column" gap="30px">
          <Area
            placeholders={{
              region: t("All regions"),
              district: t("All districts"),
              city: t("All cities and villages"),
            }}
            sx={{
              labelsSx: { fontWeight: 600 },
              inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
            }}
            withoutFieldBinding={true}
            form={form}
            names={{ region: "region", district: "district", city: "city" }}
            skipField={{ skip: { field: "district" }, when: { field: "region", id: 8 } }}
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
      </ExpandingFields>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button
            loading={loading}
            onClick={() => handleNextClick()}
            endIcon={<ArrowForwardIcon />}
            sx={{ width: "auto" }}
            disabled={!!errors?.company?.message}
          >
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
