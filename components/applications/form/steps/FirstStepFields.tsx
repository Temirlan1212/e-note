import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useEffectOnce from "@/hooks/useEffectOnce";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function FirstStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { data: regionsDictionary } = useFetch("/api/dictionaries/regions", "GET");

  useEffectOnce(() => {
    console.log(regionsDictionary);
  }, [regionsDictionary]);

  const {
    formState: { errors },
    getValues,
    trigger,
    control,
    watch,
  } = form;

  useEffectOnce(() => {
    const subscription = watch(() => triggerFields());
    return () => subscription.unsubscribe();
  }, [watch]);

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const triggerFields = async () => {
    return await trigger(["name", "id"]);
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
          name="name"
          defaultValue=""
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel>{t("Region")}</InputLabel>
              <Select
                placeholder="select"
                labelField="name"
                valueField="id"
                data={regionsDictionary?.data}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                helperText={t(fieldState.error?.message)}
                {...field}
              ></Select>
            </Box>
          )}
        />
        <Controller
          control={control}
          name="id"
          defaultValue={undefined}
          render={({ field, fieldState }) => {
            const regionId = getValues().name;
            const { data: districtsDictionary } = useFetch(`/api/dictionaries/districts?regionId=${regionId}`, "GET");

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("District")}</InputLabel>
                <Select
                  placeholder="select"
                  labelField="name"
                  valueField="id"
                  data={districtsDictionary?.data}
                  selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                  helperText={t(fieldState.error?.message)}
                  disabled={!regionId}
                  {...field}
                ></Select>
              </Box>
            );
          }}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({ field, fieldState }) => {
            const districtId = getValues().id;
            const { data: citiesDictionary } = useFetch(`/api/dictionaries/cities?districtId=${districtId}`, "GET");

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("City")}</InputLabel>
                <Select
                  placeholder="select"
                  labelField="name"
                  valueField="id"
                  data={citiesDictionary?.data}
                  selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                  helperText={t(fieldState.error?.message)}
                  disabled={!districtId}
                  {...field}
                ></Select>
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name="id"
          defaultValue={undefined}
          render={({ field, fieldState }) => {
            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("District")}</InputLabel>
                <Select
                  placeholder="select"
                  labelField="name"
                  valueField="id"
                  data={[]}
                  selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                  helperText={t(fieldState.error?.message)}
                  defaultValue={field.value}
                  {...field}
                ></Select>
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
