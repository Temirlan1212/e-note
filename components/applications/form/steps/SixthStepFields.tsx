import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VerticalStepper from "@/components/ui/VerticalStepper";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function SixthStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger, control, watch, resetField } = form;

  const id = watch("id");
  const version = watch("version");

  const { update: getDocument } = useFetch("", "GET");

  useEffectOnce(async () => {
    if (id != null && version != null) {
      const res = await getDocument(`/api/files/prepare/${id}`);
      console.log(res, id);
    }
  }, [id, version]);

  const triggerFields = async () => {
    return await trigger([]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" gap="20px">
      <VerticalStepper currentStep={6} onlyCurrentStep />
      <Box
        width="100%"
        display="flex"
        gap="30px"
        flexDirection="column"
        sx={{
          marginTop: { xs: "0", md: "16px" },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          gap={{ xs: "20px", md: "200px" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Typography variant="h4" whiteSpace="nowrap">
            {t("View document")}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="end">
          <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
            {t("Download PDF")}
          </Button>
        </Box>

        <PDFViewer fileUrl="/documents/example.pdf" />

        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {onPrev != null && (
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
              {t("Prev")}
            </Button>
          )}
          {onNext != null && (
            <Button onClick={handleNextClick} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
              {t("Next")}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
