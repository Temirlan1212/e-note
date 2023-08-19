import { Dispatch, SetStateAction, useState } from "react";
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
import Link from "@/components/ui/Link";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

export default function SixthStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger, control, watch, setValue } = form;

  const id = watch("id");

  const { data } = useFetch(id != null ? `/api/files/prepare/${id}` : "", "GET");

  useEffectOnce(() => {
    if (data?.data?.saleOrderVersion != null) {
      setValue("version", data.data.saleOrderVersion);
    }
  }, [data]);

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
    <Box display="flex" gap="30px" flexDirection="column">
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
        <Link
          href={`/api/iframe?url=${data?.data?.downloadUrl}&token=${data?.data?.token}`}
          download={data?.data?.fileName}
          target="_blank"
        >
          <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
            {t("Download PDF")}
          </Button>
        </Link>
      </Box>

      {data?.data?.editUrl != null && (
        <iframe
          src={`/api/iframe?url=${"https://cloud-test.sanarip.org/index.php/f/248959"}&token=${data?.data?.token}`}
          style={{ minHeight: "500px" }}
        ></iframe>
      )}

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
  );
}
