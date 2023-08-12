import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { format } from "date-fns";
import { IApplicationSchema } from "@/validator-schemas/application";
import { INotaryDistrict } from "@/models/dictionaries/notary-district";
import { ICompany } from "@/models/company";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import Autocomplete from "@/components/ui/Autocomplete";
import Area from "@/components/fields/Area";
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

  const city = watch("city");
  const notaryDistrict = watch("notaryDistrict");

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { update: applicationCreate } = useFetch("", "POST");

  useEffectOnce(() => {
    setMounted(true);
  });

  const triggerFields = async () => {
    return await trigger(["region", "district", "city", "notaryDistrict", "company"]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> & { creationDate: string } = {
        company: values.company,
        creationDate: format(new Date(), "yyyy-MM-dd"),
      };

      let url = "/api/applications/create";
      if (values.id != null) {
        url = `/api/applications/update/${values.id}`;
        data.id = values.id;
        data.version = values.version;
      }

      const result = await applicationCreate(url, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
        if (onNext != null) onNext();
      }

      setLoading(false);
    }
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
            const { data, loading } = useFetch(
              city != null ? `/api/dictionaries/notary-districts?cityId=${city.id}` : "",
              "GET"
            );

            useEffectOnce(() => {
              if (field.value != null && mounted && (fieldState.isTouched || !fieldState.isDirty)) {
                resetField(field.name, { defaultValue: null });
              }
            }, ["notaryDistrict", city]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Notary district")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!city}
                  options={data?.status === 0 ? (data?.data as INotaryDistrict[]) ?? [] : []}
                  loading={loading}
                  value={
                    field.value != null
                      ? (data?.data ?? []).find((item: INotaryDistrict) => item.id == field.value?.id) ?? null
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
          name="company"
          defaultValue={null}
          render={({ field, fieldState }) => {
            const { data, loading } = useFetch(
              `/api/companies${notaryDistrict != null ? "?notaryDistrictId=" + notaryDistrict.id : ""}`,
              "GET"
            );

            useEffectOnce(() => {
              if (field.value != null && mounted && (fieldState.isTouched || !fieldState.isDirty)) {
                resetField(field.name, { defaultValue: null });
              }
            }, ["company", notaryDistrict]);

            return (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Notary")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={loading}
                  options={data?.status === 0 ? (data?.data as ICompany[]) ?? [] : []}
                  loading={loading}
                  value={
                    field.value != null
                      ? (data?.data ?? []).find((item: ICompany) => item.id == field.value?.id) ?? null
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

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
