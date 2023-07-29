import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Hint from "@/components/ui/Hint";
import { InputLabel, SelectChangeEvent } from "@mui/material";
import { useRouter } from "next/router";
import { IApplicationSchema } from "@/validator-schemas/application";
import useFetch from "@/hooks/useFetch";
import { INotarialActionData } from "@/models/dictionaries/notarial-action";
import useEffectOnce from "@/hooks/useEffectOnce";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function SecondStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { trigger, control, watch, resetField } = form;
  const { data: notarialData } = useFetch<INotarialActionData>("/api/dictionaries/notarial-action", "GET");

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const triggerFields = async () => {
    return await trigger(["object", "objectType"]);
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext();
  };

  const objectVal = watch("object");
  const objectTypeVal = watch("objectType");

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Controller
        control={control}
        name="object"
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
                selectType={errorMessage ? "danger" : field.value ? "success" : "secondary"}
                data={objectList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  resetField("objectType");
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="objectType"
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const objectTypeList = notarialData?.objectType.filter((item) =>
            item["parent.value"].join(",").includes(String(objectVal))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Object type")}</InputLabel>
              <Select
                disabled={!objectVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={objectTypeList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                  resetField("notarialAction");
                }}
              />
            </Box>
          );
        }}
      />

      <Controller
        control={control}
        name="notarialAction"
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const notarialActionList = notarialData?.notarialAction.filter((item) =>
            item["parent.value"].join(",").includes(String(objectTypeVal))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Object type")}</InputLabel>
              <Select
                disabled={!objectTypeVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={notarialActionList ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectTypeVal && errorMessage ? t(errorMessage) : ""}
                value={field.value == null ? "" : field.value}
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
          <Button type="submit" endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
