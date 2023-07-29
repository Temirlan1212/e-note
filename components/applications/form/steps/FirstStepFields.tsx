import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import Autocomplete from "@/components/ui/Autocomplete";
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

  const { trigger, control, watch, resetField } = form;

  const regionId = watch("region");
  const districtId = watch("district");
  const cityId = watch("city");
  const notaryDistrictId = watch("notaryDistrict");

  const { data: regionsDictionary } = useFetch("/api/dictionaries/regions", "GET");

  const triggerFields = async () => {
    return await trigger(["region", "district", "city", "notaryDistrict", "company"]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" gap="30px" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        gap={{ xs: "20px", md: "200px" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography variant="h5" whiteSpace="nowrap">
          {t("Choose notary")}
        </Typography>
        <Hint type="hint">{t("Form first step hint text")}</Hint>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name="region"
          defaultValue={null}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Region")}</InputLabel>
              <Select
                placeholder="select"
                labelField="name"
                valueField="id"
                data={regionsDictionary?.status === 0 ? regionsDictionary.data : []}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                helperText={t(fieldState.error?.message)}
                value={field.value != null ? field.value : ""}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
              ></Select>
            </Box>
          )}
        />
        <Controller
          control={control}
          name="district"
          defaultValue={null}
          render={({ field, fieldState }) => {
            const { data: districtsDictionary } = useFetch(`/api/dictionaries/districts?regionId=${regionId}`, "GET");

            useEffectOnce(() => {
              resetField(field.name);
            }, [regionId]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("District")}</InputLabel>
                <Select
                  placeholder="select"
                  labelField="name"
                  valueField="id"
                  data={districtsDictionary?.status === 0 ? districtsDictionary.data : []}
                  selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                  helperText={t(fieldState.error?.message)}
                  disabled={!regionId}
                  value={field.value != null ? field.value : ""}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                ></Select>
              </Box>
            );
          }}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name="city"
          defaultValue={null}
          render={({ field, fieldState }) => {
            const { data: citiesDictionary } = useFetch(`/api/dictionaries/cities?districtId=${districtId}`, "GET");

            useEffectOnce(() => {
              resetField(field.name);
            }, [districtId]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("City")}</InputLabel>
                <Select
                  placeholder="select"
                  labelField="name"
                  valueField="id"
                  data={citiesDictionary?.status === 0 ? citiesDictionary.data : []}
                  selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                  helperText={t(fieldState.error?.message)}
                  disabled={!districtId}
                  value={field.value != null ? field.value : ""}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                ></Select>
              </Box>
            );
          }}
        />
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
                  placeholder="select"
                  labelField="name"
                  valueField="id"
                  data={notaryDistrictsDictionary?.status === 0 ? notaryDistrictsDictionary.data : []}
                  selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                  helperText={t(fieldState.error?.message)}
                  disabled={!cityId}
                  value={field.value != null ? field.value : ""}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                ></Select>
              </Box>
            );
          }}
        />
      </Box>

      <Controller
        control={control}
        name="company"
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
              <InputLabel>{t("Company")}</InputLabel>
              <Autocomplete
                labelField="name"
                type={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                helperText={t(fieldState.error?.message)}
                options={companyData?.status === 0 ? (companyData.data as ICompany[]) : []}
                loading={companyLoading}
                onChange={(event, value) => {
                  field.onChange(value != null ? value.id : undefined);
                  trigger(field.name);
                }}
              />
            </Box>
          );
        }}
      />

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
