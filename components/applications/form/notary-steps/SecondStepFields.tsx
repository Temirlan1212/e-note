import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { useProfileStore } from "@/stores/profile";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StepperContentStep from "@/components/ui/StepperContentStep";
import { criteriaFieldNames } from "@/pages/api/dictionaries/document-type";
import Autocomplete from "@/components/ui/Autocomplete";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined; isStepByStep: boolean }) => void;
  handleStepNextClick?: Function;
}

export default function SecondStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const profile = useProfileStore.getState();
  const t = useTranslations();

  const locale = useLocale();

  const { trigger, control, getValues, setValue, watch } = form;

  const productId = watch("product.id");

  const [loading, setLoading] = useState(false);
  const [selectedInput, setSelectedInput] = useState<"my" | "system" | null>(null);

  const { data: myDocuments, loading: myDocumentsLoading, update: getMyDocuments } = useFetch("", "POST");
  const { data: systemDocuments, loading: systemDocumentsLoading, update: getSystemDocuments } = useFetch("", "POST");
  const { update: applicationUpdate } = useFetch("", "PUT");

  useEffectOnce(async () => {
    const myDocs = await getMyDocuments("/api/dictionaries/document-type", {
      formValues: { createdBy: profile.userData?.id },
    });
    const findedMyDoc =
      myDocs?.data?.length > 0 ? myDocs?.data?.find((item: { id: number }) => item.id === productId) : null;
    if (findedMyDoc != null) {
      setSelectedInput("my");
      return Object.entries(criteriaFieldNames).map(([k, v]) => {
        setValue(k as any, findedMyDoc[v]);
      });
    }

    const sysDocs = await getSystemDocuments("/api/dictionaries/document-type", { formValues: { isSystem: true } });
    const findedSystemDoc =
      sysDocs?.data?.length > 0 ? sysDocs?.data?.find((item: { id: number }) => item.id === productId) : null;
    if (findedSystemDoc != null) {
      setSelectedInput("system");
      return Object.entries(criteriaFieldNames).map(([k, v]) => {
        setValue(k as any, findedSystemDoc[v]);
      });
    }

    if (selectedInput != null) setSelectedInput(null);
  }, [productId, profile]);

  const triggerFields = async () => {
    return await trigger(["product"]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        product: values.product,
        object: values.object,
        objectType: values.objectType,
        notarialAction: values.notarialAction,
        typeNotarialAction: values.typeNotarialAction,
        action: values.action,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("version", result.data[0].version);
        if (onNext != null) {
          onNext({ step: targetStep, isStepByStep: false });
        }
      }

      setLoading(false);
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <StepperContentStep step={2} title={t("Choose notarial action")} sx={{ flex: "1 1 100%" }} />
        {/*<Hint type="hint">{t("Notary form first step hint text")}</Hint>*/}
      </Box>

      <Box display="flex" gap="50px" alignItems="end">
        <Controller
          control={control}
          name="product"
          defaultValue={null}
          render={({ field, fieldState }) => (
            <Box width="100%" display="flex" flexDirection="column" gap="10px">
              <InputLabel>{t("Select a notarial act by name")}</InputLabel>
              <Autocomplete
                labelField={locale !== "en" ? "$t:name" : "name"}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                disabled={selectedInput !== "system" && selectedInput !== null}
                options={systemDocuments?.status === 0 ? (systemDocuments?.data as Record<string, any>[]) ?? [] : []}
                loading={systemDocumentsLoading}
                value={
                  field.value != null
                    ? (systemDocuments?.data ?? []).find((item: Record<string, any>) => item.id == field.value?.id) ??
                      null
                    : null
                }
                onBlur={field.onBlur}
                onChange={(event, value) => {
                  field.onChange(
                    value?.id != null
                      ? {
                          id: value.id,
                          oneSideAction: value.hasOwnProperty("oneSideAction")
                            ? typeof value.oneSideAction === "boolean"
                              ? value.oneSideAction
                              : false
                            : false,
                          isProductCancelled: value.hasOwnProperty("isProductCancelled")
                            ? typeof value.isProductCancelled === "boolean"
                              ? value.isProductCancelled
                              : false
                            : false,
                        }
                      : null
                  );
                  trigger(field.name);
                }}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name="product"
          defaultValue={null}
          render={({ field, fieldState }) => {
            return (
              <Box width="100%" display="flex" flexDirection="column" gap="10px">
                <InputLabel>{t("Select document from my templates")}</InputLabel>
                <Autocomplete
                  labelField="name"
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={selectedInput !== "my" && selectedInput !== null}
                  options={myDocuments?.status === 0 ? (myDocuments?.data as Record<string, any>[]) ?? [] : []}
                  loading={myDocumentsLoading}
                  value={
                    field.value != null
                      ? (myDocuments?.data ?? []).find((item: Record<string, any>) => item.id == field.value?.id) ??
                        null
                      : null
                  }
                  onBlur={field.onBlur}
                  onChange={(event, value) => {
                    field.onChange(
                      value?.id != null
                        ? {
                            id: value.id,
                            oneSideAction: value.hasOwnProperty("oneSideAction")
                              ? typeof value.oneSideAction === "boolean"
                                ? value.oneSideAction
                                : false
                              : false,
                            isProductCancelled: value.hasOwnProperty("isProductCancelled")
                              ? typeof value.isProductCancelled === "boolean"
                                ? value.isProductCancelled
                                : false
                              : false,
                          }
                        : null
                    );
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
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button
            loading={loading}
            onClick={() => handleNextClick()}
            endIcon={<ArrowForwardIcon />}
            sx={{ width: "auto" }}
          >
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
