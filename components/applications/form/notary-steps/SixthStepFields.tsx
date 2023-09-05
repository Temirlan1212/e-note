import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import Link from "@/components/ui/Link";
import SignModal from "@/components/applications/SignModal";
import StepperContentStep from "@/components/ui/StepperContentStep";

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

  const { data, loading } = useFetch(id != null ? `/api/files/prepare/${id}` : "", "GET");
  const { data: conversionData, loading: conversionLoading } = useFetch(
    id != null ? `/api/files/document-conversion/${id}` : "",
    "GET"
  );

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
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", lg: "row" }}>
        <StepperContentStep step={6} title={t("View document")} loading={loading || conversionLoading} />

        {!loading && !conversionLoading && data?.data?.token && (
          <Box display="flex" gap="10px" flexDirection={{ xs: "column", md: "row" }}>
            <Link
              href={`/api/iframe?url=${data?.data?.downloadUrl}&token=${data?.data?.token}`}
              download={data?.data?.fileName}
              target="_blank"
            >
              <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
                {t("Download PDF")}
              </Button>
            </Link>

            <Link
              href={`${data?.data?.editUrl}?AuthorizationBasic=${data?.data?.token.replace(/Basic /, "")}`}
              target="_blank"
            >
              <Button startIcon={<EditIcon />} sx={{ width: "auto" }}>
                {t("Edit")}
              </Button>
            </Link>

            <SignModal />
          </Box>
        )}
      </Box>

      {!conversionLoading && data?.data?.token && (
        <PDFViewer
          fileUrl={
            conversionData?.data?.pdfLink
              ? `/api/iframe?url=${conversionData?.data?.pdfLink}&token=${data?.data?.token}`
              : "/"
          }
        />
      )}

      {!loading && !conversionLoading && (
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
      )}
    </Box>
  );
}
