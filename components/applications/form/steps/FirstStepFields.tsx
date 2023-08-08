import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { format } from "date-fns";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import Autocomplete from "@/components/ui/Autocomplete";
import Area from "@/components/fields/Area";
import { ICompany } from "@/models/company";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function FirstStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField, getValues, setValue } = form;

  const cityId = watch("city");
  const notaryDistrictId = watch("notaryDistrict");

  const { update: applicationCreate } = useFetch("", "POST");

  const triggerFields = async () => {
    return await trigger(["region", "district", "city", "notaryDistrict", "company"]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();

    if (validated) {
      const values = getValues();
      const data: Partial<IApplicationSchema> & { creationDate: string } = {
        company: values.company,
        creationDate: format(new Date(), "yyyy-MM-dd"),
      };

      const result = await applicationCreate("/api/applications/create", data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
      }
    }

    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        gap={{ xs: "20px", md: "200px" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography variant="h4" whiteSpace="nowrap">
          {t("Choose notary")}
        </Typography>
        <Hint type="hint">{t("Form first step hint text")}</Hint>
      </Box>

      <Area form={form} names={{ region: "region", district: "district", city: "city" }} />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name="notaryDistrict"
          defaultValue={null}
          render={({ field, fieldState }) => {
            const { data: notaryDistrictsDictionary } = useFetch(
              `/api/dictionaries/notary-districts?cityId=${cityId}`,
              "GET"
            );

            useEffectOnce(() => {
              resetField(field.name);
            }, [cityId]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Notary district")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!cityId}
                  data={notaryDistrictsDictionary?.status === 0 ? notaryDistrictsDictionary?.data ?? [] : []}
                  {...field}
                  value={field.value != null ? field.value : ""}
                ></Select>
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name="company.id"
          render={({ field, fieldState }) => {
            const { data: companyData, loading: companyLoading } = useFetch(
              `/api/companies${notaryDistrictId != null ? "?notaryDistrictId=" + notaryDistrictId : ""}`,
              "GET"
            );

            useEffectOnce(() => {
              resetField(field.name);
            }, [notaryDistrictId]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Notary")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  options={companyData?.status === 0 ? (companyData?.data as ICompany[]) ?? [] : []}
                  loading={companyLoading}
                  value={
                    field.value != null
                      ? (companyData?.data ?? []).find((item: ICompany) => item.id == field.value)
                      : null
                  }
                  onBlur={field.onBlur}
                  onChange={(event, value) => {
                    field.onChange(value != null ? value.id : undefined);
                    trigger(field.name);
                  }}
                />
              </Box>
            );
          }}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
