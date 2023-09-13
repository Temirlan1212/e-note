import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import Link from "@/components/ui/Link";
import StepperContentStep from "@/components/ui/StepperContentStep";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function SixthStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger, control, watch, setValue } = form;

  const id = watch("id");

  const [docUrl, setDocUrl] = useState<string>();
  const [isSigned, setIsSigned] = useState(false);

  const { loading: pdfLoading, update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { loading: prepareLoading, update: getPrepare } = useFetch("", "GET");
  const { data: application, loading: applicationLoading } = useFetch(
    id != null ? `/api/applications/${id}` : "",
    "POST"
  );

  useEffectOnce(async () => {
    const applicationData = application?.data?.[0];

    if (applicationData?.documentInfo?.pdfLink != null && applicationData?.documentInfo?.token != null) {
      handlePdfDownload(applicationData.documentInfo.pdfLink, applicationData.documentInfo.token);
    }

    switch (applicationData?.statusSelect) {
      case 1:
        setIsSigned(true);
        break;
      case 2:
        const prepareData = await getPrepare(`/api/files/prepare/${id}`);
        if (prepareData?.data?.saleOrderVersion != null) {
          setValue("version", prepareData.data.saleOrderVersion);
        }

        if (prepareData?.data?.pdfLink != null && prepareData?.data?.token != null) {
          handlePdfDownload(prepareData.data.pdfLink, prepareData.data.token);
        }
        break;
    }
  }, [application]);

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

  const handlePdfDownload = async (pdfLink: string, token: string) => {
    if (!pdfLink || !token) return;

    const pdfResponse = await getPdf(`/api/adapter?url=${pdfLink}&token=${token}`);
    const blob = await pdfResponse?.blob();
    if (blob == null) return;

    setDocUrl(URL.createObjectURL(blob));
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", lg: "row" }}>
        <StepperContentStep
          step={6}
          title={t("View document")}
          loading={applicationLoading || prepareLoading || pdfLoading}
        />

        {docUrl && (
          <Link href={docUrl} target="_blank">
            <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
              {t("Download PDF")}
            </Button>
          </Link>
        )}
      </Box>

      {docUrl && <PDFViewer fileUrl={docUrl} />}

      {!applicationLoading && !prepareLoading && !pdfLoading && (
        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {!isSigned && onPrev != null && (
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
