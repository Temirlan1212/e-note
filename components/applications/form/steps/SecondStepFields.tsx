import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Hint from "@/components/ui/Hint";
import { useRouter } from "next/router";
import { INotarialActionData } from "@/models/dictionaries/notarial-action";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function SecondStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();

  const { data: notarialData, loading } = useFetch<INotarialActionData>("/api/dictionaries/notarial-action", "GET");

  const { trigger, control, watch, resetField, getValues, setValue } = form;

  const objectVal = watch("object");
  const objectTypeVal = watch("objectType");
  const notarialActionVal = watch("notarialAction");
  const typeNotarialActionVal = watch("typeNotarialAction");
  const actionVal = watch("action");

  const [formValues, setformValues] = useState<Record<string, any>>({});

  const { data: searchedDocData } = useFetch("/api/dictionaries/document-type", "POST", {
    body: formValues,
  });

  const { update: applicationUpdate } = useFetch("", "PUT");

  useEffectOnce(() => {
    if (actionVal != null) {
      const values = getValues();
      setformValues({ formValues: values });
    }
  }, [actionVal]);

  const triggerFields = async () => {
    return await trigger(["object", "objectType"]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();

    if (validated) {
      const values = getValues();
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        object: values.object,
        objectType: values.objectType,
        notarialAction: values.notarialAction,
        typeNotarialAction: values.typeNotarialAction,
        action: values.action,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
      }
    }

    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Box
        display="flex"
        justifyContent="space-between"
        gap={{ xs: "20px", md: "200px" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography variant="h4" whiteSpace="nowrap">
          {t("Choose notary")}
        </Typography>
      </Box>

      <Controller
        control={control}
        name="object"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const objectList = notarialData?.object;
          const errorMessage = fieldState.error?.message;
          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap="10px 20px" alignItems="end">
                <InputLabel>{t("Object")}</InputLabel>
                <Hint type="hint" maxWidth="520px">
                  {t("second-step-hint-title")}
                </Hint>
              </Box>

              <Select
                fullWidth
                selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
                data={objectList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={errorMessage ? t(errorMessage) : ""}
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
        name="objectType"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const objectTypeList = notarialData?.objectType.filter((item) =>
            item["parent.value"].join(",").includes(String(objectVal))
          );

          useEffectOnce(() => {
            resetField(field.name);
          }, [objectVal]);

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Object type")}</InputLabel>
              <Select
                disabled={!objectVal}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                data={objectTypeList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectVal && errorMessage ? t(errorMessage) : ""}
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
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
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
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
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
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
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
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
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
