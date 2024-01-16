import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NotarialAction from "@/components/fields/NotarialAction";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

const fields = ["object", "objectType", "notarialAction", "typeNotarialAction", "action", "product"] as const;

export default function ThirdStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();

  const {
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const [loading, setLoading] = useState(false);

  const { update: applicationUpdate } = useFetch("", "PUT");
  const triggerFields = async () => {
    return await trigger(fields);
  };

  const focusToFieldOnError = () => {
    for (let i = 0; i < fields.length; i++) {
      if (errors != null && errors?.[fields[i]]) {
        form.setFocus(fields[i]);
        break;
      }
    }
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();
    if (!validated) focusToFieldOnError();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        object: values.object,
        objectType: values.objectType,
        notarialAction: values.notarialAction,
        typeNotarialAction: values.typeNotarialAction,
        action: values.action,
        product: values.product,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("version", result.data[0].version);
        if (onNext != null) onNext({ step: targetStep });
      }

      setLoading(false);
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <NotarialAction step={3} form={form} />

      <Box width="fit-content" position="sticky" bottom="30px" display="flex" gap="20px" flexDirection="row">
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
            disabled={!!errors?.product?.message}
          >
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
