import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/router";
import { INotarialActionData } from "@/models/dictionaries/notarial-action";
import useEffectOnce from "@/hooks/useEffectOnce";
import { useState } from "react";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function ThirdStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { data: notarialData, loading } = useFetch<INotarialActionData>("/api/dictionaries/notarial-action", "GET");
  const [formValues, setformValues] = useState<Record<string, any>>({});

  const { data: searchedDocData } = useFetch("/api/dictionaries/document-type", "POST", {
    body: formValues,
  });

  const { trigger, control, watch, resetField, getValues } = form;

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const triggerFields = async () => {
    return await trigger(["notarialAction", "typeNotarialAction", "action"]);
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext();
  };

  const objectTypeVal = watch("objectType");
  const notarialActionVal = watch("notarialAction");
  const typeNotarialActionVal = watch("typeNotarialAction");
  const actionVal = watch("action");

  useEffectOnce(() => {
    if (actionVal != null) {
      const values = getValues();
      setformValues({ formValues: values });
    }
  }, [actionVal]);

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Box
        display="flex"
        justifyContent="space-between"
        gap={{ xs: "20px", md: "200px" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography variant="h5" whiteSpace="nowrap">
          {t("Document selection")}
        </Typography>
      </Box>

      <Controller
        control={control}
        name="notarialAction"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const notarialActionList = notarialData?.notarialAction.filter((item) =>
            item["parent.value"].join(",").includes(String(objectTypeVal))
          );

          useEffectOnce(() => {
            resetField(field.name);
          }, [objectTypeVal]);

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Notarial action")}</InputLabel>
              <Select
                disabled={!objectTypeVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={notarialActionList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectTypeVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={loading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="typeNotarialAction"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const typeNotarialActionList = notarialData?.typeNotarialAction.filter((item) =>
            item["parent.value"].join(",").includes(String(notarialActionVal))
          );

          useEffectOnce(() => {
            resetField(field.name);
          }, [notarialActionVal]);

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Type of notarial action")}</InputLabel>
              <Select
                disabled={!notarialActionVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={typeNotarialActionList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!notarialActionVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={loading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="action"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const actionList = notarialData?.action.filter((item) =>
            item["parent.value"].join(",").includes(String(typeNotarialActionVal))
          );

          useEffectOnce(() => {
            resetField(field.name);
          }, [typeNotarialActionVal]);

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Action")}</InputLabel>
              <Select
                disabled={!typeNotarialActionVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={actionList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!typeNotarialActionVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={loading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="product.id"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;

          useEffectOnce(() => {
            resetField(field.name);
          }, [actionVal]);

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Searched document")}</InputLabel>
              <Select
                disabled={!actionVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={searchedDocData?.data ?? []}
                labelField="name"
                valueField="id"
                helperText={!!actionVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={loading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
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
