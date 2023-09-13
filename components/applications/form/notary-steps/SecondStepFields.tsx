import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { useProfileStore } from "@/stores/profile";
import { IProduct } from "@/models/product";
import { Box, InputLabel } from "@mui/material";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StepperContentStep from "@/components/ui/StepperContentStep";
import { criteriaFieldNames } from "@/pages/api/dictionaries/document-type";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

export default function SecondStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const profile = useProfileStore.getState();
  const t = useTranslations();

  const { trigger, control, getValues, setValue, watch } = form;
  const [step, setStep] = stepState;

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
      return Object.keys(criteriaFieldNames).map((item) => setValue(item as any, findedMyDoc[item]));
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

  const handleNextClick = async () => {
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
          setStep(step + 2);
          onNext();
        }
      }

      setLoading(false);
    }
  };

  const handleStepByStepClick = () => {
    if (onNext != null) {
      onNext();
      setStep(step + 1);
    }
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <StepperContentStep step={2} title={t("Choose document from templates")} sx={{ flex: "1 1 100%" }} />
        <Hint type="hint">{t("Notary form first step hint text")}</Hint>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name="product.id"
          defaultValue={null}
          render={({ field, fieldState }) => {
            return (
              <Box width="100%" display="flex" flexDirection="column" gap="10px">
                <InputLabel>{t("Select document from my templates")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  disabled={selectedInput !== "my" && selectedInput !== null}
                  data={myDocuments?.status === 0 ? (myDocuments?.data as IProduct[]) ?? [] : []}
                  loading={myDocumentsLoading}
                  value={field.value == null ? "" : field.value}
                  onBlur={field.onBlur}
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
            return (
              <Box width="100%" display="flex" flexDirection="column" gap="10px">
                <InputLabel>{t("Select document from system templates")}</InputLabel>
                <Select
                  labelField="name"
                  valueField="id"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  disabled={selectedInput !== "system" && selectedInput !== null}
                  data={systemDocuments?.status === 0 ? (systemDocuments?.data as IProduct[]) ?? [] : []}
                  loading={systemDocumentsLoading}
                  value={field.value == null ? "" : field.value}
                  onBlur={field.onBlur}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
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
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
            {t("Next")}
          </Button>
        )}
        <Button
          onClick={handleStepByStepClick}
          endIcon={<ArrowForwardIcon />}
          buttonType="secondary"
          sx={{ width: "auto" }}
        >
          {t("Choose step by step")}
        </Button>
      </Box>
    </Box>
  );
}
