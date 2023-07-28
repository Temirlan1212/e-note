import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Hint from "@/components/ui/Hint";
import { InputLabel } from "@mui/material";
import { useRouter } from "next/router";
import { IApplicationSchema } from "@/validator-schemas/application";
import useFetch from "@/hooks/useFetch";
import { INotarialActionData } from "@/models/dictionaries/notarial-action";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function SecondStepFields({ form, onNext, onPrev }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { trigger, control, watch, resetField, getValues } = form;
  const { data: dataBek } = useFetch<INotarialActionData>("/api/dictionaries/notarial-action", "GET");

  const stepNameList: (keyof IApplicationSchema)[] = [
    "object",
    "objectType",
    "notarialAction",
    "typeNotarialAction",
    "action",
  ];

  const objectId = watch("object");
  const objectTypeId = watch("objectType");
  const notarialActionId = watch("notarialAction");
  const typeNotarialActionId = watch("typeNotarialAction");

  const resetFields = (fields: (keyof IApplicationSchema)[]) => {
    fields.map((field) => resetField(field));
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await trigger(stepNameList);
    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Controller
        control={control}
        name="object"
        defaultValue=""
        render={({ field, fieldState }) => {
          const objectData = dataBek?.object;

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
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={objectData ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={fieldState.error?.message}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("object");
                  resetFields(stepNameList.slice(1, stepNameList.length));
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="objectType"
        defaultValue=""
        render={({ field, fieldState }) => {
          const objectType = dataBek?.objectType.filter((item) =>
            item["parent.value"].join(",").includes(String(objectId))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Object type")}</InputLabel>
              <Select
                disabled={!objectId}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={objectType ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectId ? fieldState.error?.message : ""}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("objectType");
                  resetFields(stepNameList.slice(2, stepNameList.length));
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="notarialAction"
        defaultValue=""
        render={({ field, fieldState }) => {
          const notarialActionData = dataBek?.notarialAction.filter((item) =>
            item["parent.value"].join(",").includes(String(objectTypeId))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>notarialAction</InputLabel>
              <Select
                disabled={!objectTypeId}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={notarialActionData ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectTypeId ? fieldState.error?.message : ""}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("notarialAction");
                  resetFields(stepNameList.slice(3, stepNameList.length));
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="typeNotarialAction"
        defaultValue=""
        render={({ field, fieldState }) => {
          const typeNotarialActionData = dataBek?.typeNotarialAction.filter((item) =>
            item["parent.value"].join(",").includes(String(notarialActionId))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>typeNotarialAction</InputLabel>
              <Select
                disabled={!notarialActionId}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={typeNotarialActionData ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!notarialActionId ? fieldState.error?.message : ""}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("typeNotarialAction");
                  resetFields(stepNameList.slice(4, stepNameList.length));
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="action"
        defaultValue=""
        render={({ field, fieldState }) => {
          const actionData = dataBek?.action.filter((item) =>
            item["parent.value"].join(",").includes(String(typeNotarialActionId))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>action</InputLabel>
              <Select
                disabled={!typeNotarialActionId}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={actionData ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!typeNotarialActionId ? fieldState.error?.message : ""}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("action");
                }}
              />
            </Box>
          );
        }}
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
            Prev
          </Button>
        )}
        {onNext != null && (
          <Button onClick={handleNextClick} type="submit" endIcon={<ArrowForwardIcon />}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}
