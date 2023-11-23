import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StepperContentStep from "@/components/ui/StepperContentStep";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined; isStepByStep: boolean }) => void;
  handleStepNextClick?: Function;
  step?: number;
}

export default function SelectTemplateSelectionType({
  form,
  onPrev,
  onNext,
  handleStepNextClick,
  step = 2,
}: IStepFieldsProps) {
  const t = useTranslations();

  const { setValue } = form;

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async (targetStep?: number) => {
    if (onNext != null) {
      setValue("selectTemplateFromMade", true);
      onNext({ step: targetStep, isStepByStep: false });
    }
  };

  const handleStepByStepClick = () => {
    if (onNext != null) {
      setValue("selectTemplateFromMade", false);
      onNext({ step: undefined, isStepByStep: true });
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <StepperContentStep step={step} title={t("Choose notarial action")} sx={{ flex: "1 1 100%" }} />
        {/*<Hint type="hint">{t("Notary form first step hint text")}</Hint>*/}
      </Box>

      <Box display="flex" gap="50px" alignItems="end">
        <Box
          display="flex"
          gap="10px"
          height="auto"
          alignItems="center"
          flexDirection={{ xs: "column", md: "row" }}
          width="100%"
        >
          <Button onClick={() => handleNextClick()} buttonType="secondary" sx={{ maxWidth: "400px", height: "100px" }}>
            {t("Select from the list")}
          </Button>

          <Typography variant="h5" color="secondary">
            {t("Or").toUpperCase()}
          </Typography>

          <Button onClick={handleStepByStepClick} buttonType="secondary" sx={{ maxWidth: "400px", height: "100px" }}>
            {t("Select by questionnaire")}
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
            {t("Prev")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
