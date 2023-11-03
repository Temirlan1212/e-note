import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, InputLabel } from "@mui/material";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import { useRouter } from "next/router";
import { INotarialActionData } from "@/models/notarial-action";
import StepperContentStep from "@/components/ui/StepperContentStep";
import Autocomplete from "@/components/ui/Autocomplete";

export interface INotarialActionProps {
  form: UseFormReturn<any>;
  step: number;
}

export default function NotarialAction({ form, step }: INotarialActionProps) {
  const t = useTranslations();
  const { locale } = useRouter();

  const { trigger, control, watch, resetField, getValues, setValue } = form;

  const objectVal = watch("object");
  const objectTypeVal = watch("objectType");
  const notarialActionVal = watch("notarialAction");
  const typeNotarialActionVal = watch("typeNotarialAction");
  const actionVal = watch("action");

  const { data: objectData, loading: objectLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=object`,
    "POST"
  );

  const { data: objectTypeData, loading: objectTypeLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=objectType&parentId=${objectVal}`,
    "POST"
  );

  const { data: notarialActionData, loading: notarialActionLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=notarialAction&parentId=${objectTypeVal}`,
    "POST"
  );

  const { data: typeNotarialActionData, loading: typeNotarialActionLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=typeNotarialAction&parentId=${notarialActionVal}`,
    "POST"
  );

  const { data: actionData, loading: actionLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=action&parentId=${typeNotarialActionVal}`,
    "POST"
  );

  const { data: searchedDocData, loading: searchedDocLoading, update: updateSearchedDoc } = useFetch("", "POST");

  useEffectOnce(() => {
    if (actionVal != null) {
      const { action } = getValues();
      updateSearchedDoc("/api/dictionaries/document-type", {
        formValues: { action },
      });
    }
  }, [actionVal]);

  return (
    <>
      <StepperContentStep step={+`${step}.1`} title={t("Choose object")} />

      <Controller
        control={control}
        name="object"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const objectList = objectData?.data;
          const errorMessage = fieldState.error?.message;
          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap="10px 20px" alignItems="end">
                <InputLabel>{t("Objects of civil rights")}</InputLabel>
                <Hint type="hint" maxWidth="520px">
                  {t("second-step-hint-title")}
                </Hint>
              </Box>

              <Select
                fullWidth
                selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
                data={objectList ?? []}
                labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                valueField="id"
                helperText={errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={objectLoading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  ["objectType", "notarialAction", "typeNotarialAction", "action", "product"].map((item: any) =>
                    resetField(item, { defaultValue: null })
                  );
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
          const objectTypeList = objectTypeData?.data;
          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Object type")}</InputLabel>
              <Select
                disabled={!objectVal}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                data={objectTypeList ?? []}
                labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                valueField="id"
                helperText={!!objectVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={objectTypeLoading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  ["notarialAction", "typeNotarialAction", "action", "product"].map((item: any) =>
                    resetField(item, { defaultValue: null })
                  );
                }}
              />
            </Box>
          );
        }}
      />

      <StepperContentStep step={+`${step}.2`} title={t("Choose document")} />

      <Controller
        control={control}
        name="notarialAction"
        defaultValue={null}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const notarialActionList = notarialActionData?.data;

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Notarial action")}</InputLabel>
              <Select
                disabled={!objectTypeVal}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                data={notarialActionList ?? []}
                labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                valueField="id"
                helperText={!!objectTypeVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={notarialActionLoading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  ["typeNotarialAction", "action", "product"].map((item: any) =>
                    resetField(item, { defaultValue: null })
                  );
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
          const typeNotarialActionList = typeNotarialActionData?.data;

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Type of notarial action")}</InputLabel>
              <Select
                disabled={!notarialActionVal}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                data={typeNotarialActionList ?? []}
                labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                valueField="id"
                helperText={!!notarialActionVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={typeNotarialActionLoading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  ["action", "product"].map((item: any) => resetField(item, { defaultValue: null }));
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
          const actionList = actionData?.data;

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Purpose of action")}</InputLabel>
              <Select
                disabled={!typeNotarialActionVal}
                selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                data={actionList ?? []}
                labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                valueField="id"
                helperText={!!typeNotarialActionVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onBlur={field.onBlur}
                loading={actionLoading}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  resetField("product", { defaultValue: null });
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="product"
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Box width="100%" display="flex" flexDirection="column" gap="10px">
            <InputLabel>{t("Document")}</InputLabel>
            <Autocomplete
              disabled={!actionVal}
              labelField={locale !== "en" ? "$t:name" : "name"}
              type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
              helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              options={searchedDocData?.status === 0 ? (searchedDocData?.data as Record<string, any>[]) ?? [] : []}
              loading={searchedDocLoading}
              value={
                field.value != null
                  ? (Array.isArray(searchedDocData?.data) ? searchedDocData?.data : [])?.find(
                      (item: Record<string, any>) => item.id == field.value?.id
                    ) ?? null
                  : null
              }
              onBlur={field.onBlur}
              onChange={(event, value) => {
                field.onChange(value?.id != null ? { id: value.id } : null);
                trigger(field.name);
              }}
            />
          </Box>
        )}
      />
    </>
  );
}
