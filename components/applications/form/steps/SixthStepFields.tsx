import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import StepperContentStep from "@/components/ui/StepperContentStep";
import SyncIcon from "@mui/icons-material/Sync";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function SixthStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
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
    let initialLoad = true;

    if (applicationData?.documentInfo?.pdfLink != null && applicationData?.documentInfo?.token != null) {
      handlePdfDownload(applicationData.documentInfo.pdfLink, applicationData.documentInfo.token);
      initialLoad = false;
    }

    switch (applicationData?.statusSelect) {
      case 1:
        setIsSigned(true);
        break;
      case 2:
        if (!initialLoad) break;
        handlePrepareDocument();
        break;
    }
  }, [application]);

  const triggerFields = async () => {
    return await trigger([]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext({ step: targetStep });
  };

  const handlePdfDownload = async (pdfLink: string, token: string) => {
    if (!pdfLink || !token) return;

    const pdfResponse = await getPdf(`/api/adapter?url=${pdfLink}&token=${token}`);
    const blob = await pdfResponse?.blob();
    if (blob == null) return;

    setDocUrl(URL.createObjectURL(blob));
  };

  const handlePrepareDocument = async () => {
    const prepareData = await getPrepare(`/api/files/prepare/${id}`);
    if (prepareData?.data?.saleOrderVersion != null) {
      setValue("version", prepareData.data.saleOrderVersion);
    }

    if (prepareData?.data?.pdfLink != null && prepareData?.data?.token != null) {
      handlePdfDownload(prepareData.data.pdfLink, prepareData.data.token);
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap="20px">
        <StepperContentStep
          step={6}
          title={t("View document")}
          loading={applicationLoading || prepareLoading || pdfLoading}
        />

        {!applicationLoading && !prepareLoading && !pdfLoading && (
          <ConfirmationModal
            title="Rebuild the document"
            type="hint"
            hintTitle=""
            hintText={"All changes made earlier in the document will be lost"}
            onConfirm={handlePrepareDocument}
          >
            <Button startIcon={<SyncIcon />} sx={{ width: "auto" }}>
              {t("Rebuild the document")}
            </Button>
          </ConfirmationModal>
        )}
      </Box>

      {docUrl && <PDFViewer fileUrl={docUrl} />}

      {!applicationLoading && !prepareLoading && !pdfLoading && (
        <Box position="sticky" bottom="20px" display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {!isSigned && onPrev != null && (
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
              {t("Prev")}
            </Button>
          )}
          {onNext != null && (
            <Button onClick={() => handleNextClick()} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
              {t("Next")}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
