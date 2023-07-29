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

export default function SecondStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { trigger, control, watch, resetField, setValue } = form;
  const { data: notarialData } = useFetch<INotarialActionData>("/api/dictionaries/notarial-action", "GET");

  const formFields: (keyof IApplicationSchema)[] = [
    "object",
    "objectType",
    "notarialAction",
    "typeNotarialAction",
    "action",
  ];

  const resetFields = (fields: (keyof IApplicationSchema)[]) => {
    fields.map((field) => resetField(field));
  };

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

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Controller
        control={control}
        name="object"
        defaultValue=""
        render={({ field, fieldState }) => {
          const objectData = notarialData?.object;
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
                data={objectData ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={errorMessage ? t(errorMessage) : ""}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("object");
                  resetFields(formFields.slice(1, formFields.length));
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
          const errorMessage = fieldState.error?.message;
          const objectVal = watch("object");
          const objectType = notarialData?.objectType.filter((item) =>
            item["parent.value"].join(",").includes(String(objectVal))
          );

          return (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Object type")}</InputLabel>
              <Select
                disabled={!objectVal}
                selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
                data={objectType ?? []}
                labelField={"title_" + locale}
                valueField="value"
                helperText={!!objectVal && errorMessage ? t(errorMessage) : ""}
                {...field}
                onChange={(...event: any[]) => {
                  field.onChange(...event);
                  trigger("objectType");
                  resetFields(formFields.slice(2, formFields.length));
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
