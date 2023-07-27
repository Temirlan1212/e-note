import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { IApplication } from "@/models/applications/application";
import { Box, FormControl, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useEffectOnce from "@/hooks/useEffectOnce";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplication>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function FirstStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { data: regionsDictionary } = useFetch("/api/dictionaries/regions", "GET");
  const { data: districtsDictionary } = useFetch("/api/dictionaries/districts", "GET");
  const { data: citiesDictionary } = useFetch("/api/dictionaries/cities?districtId=6", "GET");

  useEffectOnce(() => {
    console.log(regionsDictionary);
  }, [regionsDictionary]);

  useEffectOnce(() => {
    console.log(districtsDictionary);
  }, [districtsDictionary]);

  useEffectOnce(() => {
    console.log(citiesDictionary);
  }, [citiesDictionary]);

  const {
    formState: { errors },
    trigger,
    register,
  } = form;

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await trigger(["name"]);
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
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              fontSize: "18px",
              top: "10px",
              left: "-14px",
              fontWeight: "500",
              position: "inherit",
            }}
          >
            {t("Region")}
          </InputLabel>
          <Select
            placeholder="select"
            data={[
              { value: "1", label: t("Choose a device") },
              { value: "2", label: t("noki") },
            ]}
            defaultValue={"1"}
            register={register}
            name="name"
          ></Select>
        </FormControl>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              fontSize: "18px",
              top: "10px",
              left: "-14px",
              fontWeight: "500",
              position: "inherit",
            }}
          >
            {t("District")}
          </InputLabel>
          <Select placeholder="select" data={[{ value: "1", label: t("Choose a device") }]} defaultValue={"1"}></Select>
        </FormControl>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              fontSize: "18px",
              top: "10px",
              left: "-14px",
              fontWeight: "500",
              position: "inherit",
            }}
          >
            {t("City")}
          </InputLabel>
          <Select placeholder="select" data={[{ value: "1", label: t("Choose a device") }]} defaultValue={"1"}></Select>
        </FormControl>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              fontSize: "18px",
              top: "10px",
              left: "-14px",
              fontWeight: "500",
              position: "inherit",
            }}
          >
            {t("Notary District")}
          </InputLabel>
          <Select placeholder="select" data={[{ value: "1", label: t("Choose a device") }]} defaultValue={"1"}></Select>
        </FormControl>
      </Box>

      <FormControl sx={{ width: "100%" }}>
        <InputLabel
          sx={{
            fontSize: "18px",
            top: "10px",
            left: "-14px",
            fontWeight: "500",
            position: "inherit",
          }}
        >
          {t("Notary")}
        </InputLabel>
        <Select placeholder="select" data={[{ value: "1", label: t("Choose a device") }]} defaultValue={"1"}></Select>
      </FormControl>

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
