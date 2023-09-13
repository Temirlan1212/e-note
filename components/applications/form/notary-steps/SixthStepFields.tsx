import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import useConvert from "@/hooks/useConvert";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Backdrop, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import Link from "@/components/ui/Link";
import SignModal from "@/components/e-sign/SignModal";
import StepperContentStep from "@/components/ui/StepperContentStep";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function SixthStepFields({ form, stepState, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const convert = useConvert();

  const { trigger, control, watch, setValue } = form;

  const id = watch("id");
  const version = watch("version");

  const [base64Doc, setBase64Doc] = useState<string>();
  const [docUrl, setDocUrl] = useState<string>();
  const [token, setToken] = useState<string>();
  const [isSigned, setIsSigned] = useState(false);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);

  const { loading: pdfLoading, update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { data: prepare, loading: prepareLoading, update: getPrepare } = useFetch("", "GET");
  const { loading: syncLoading, update: getSync } = useFetch("", "GET");
  const { update: applicationUpdate } = useFetch("", "PUT");
  const { loading: signLoading, update: signDocument } = useFetch("", "POST");
  const { data: application, loading: applicationLoading } = useFetch(
    id != null ? `/api/applications/${id}` : "",
    "POST"
  );

  useEffectOnce(async () => {
    const applicationData = application?.data?.[0];

    if (applicationData?.documentInfo?.pdfLink != null && applicationData?.documentInfo?.token != null) {
      setToken(applicationData.documentInfo.token);
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
          setToken(prepareData.data.token);
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

  const handleNextClick = async (stepIndex?: number) => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext({ step: stepIndex });
  };

  const handleSyncClick = async () => {
    setIsBackdropOpen(false);

    const syncData = await getSync(`/api/files/sync/${id}`);
    if (syncData?.data?.pdfLink != null && token != null) {
      handlePdfDownload(syncData.data.pdfLink, token);
    }
  };

  const handlePdfDownload = async (pdfLink: string, token: string) => {
    if (!pdfLink || !token) return;

    const pdfResponse = await getPdf(`/api/adapter?url=${pdfLink}&token=${token}`);
    const blob = await pdfResponse?.blob();
    if (blob == null) return;

    setBase64Doc(await convert.blob.toBase64Async(blob));
    setDocUrl(URL.createObjectURL(blob));
  };

  const handleSign = async (sign: string) => {
    const signedPdf = await signDocument(`/api/files/sign/${id}`, { hash: sign });

    if (signedPdf?.data?.pdfLink != null && token != null) {
      await handlePdfDownload(signedPdf.data.pdfLink, token);

      const result = await applicationUpdate(`/api/applications/update/${id}`, {
        version,
        statusSelect: 1,
      });

      if (result?.data?.[0]?.id != null) {
        setValue("version", result.data[0].version);
      }

      setIsSigned(true);
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Backdrop open={isBackdropOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <IconButton onClick={handleSyncClick}>
          <SyncIcon
            sx={{
              width: 100,
              height: 100,
              borderRadius: 100,
              boxShadow: 10,
              p: 1,
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
            }}
          />
        </IconButton>
      </Backdrop>

      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", lg: "row" }}>
        <StepperContentStep
          step={6}
          title={t("View document")}
          loading={applicationLoading || prepareLoading || pdfLoading || signLoading || syncLoading}
        />

        <Box display="flex" gap="10px" flexDirection={{ xs: "column", md: "row" }}>
          {docUrl && (
            <Link href={docUrl} target="_blank">
              <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
                {t("Download PDF")}
              </Button>
            </Link>
          )}

          {!isSigned && token && prepare?.data?.editUrl != null && (
            <Link
              href={`${prepare.data.editUrl}?AuthorizationBasic=${token.replace(/Basic /, "")}`}
              target="_blank"
              onClick={() => setIsBackdropOpen(true)}
            >
              <Button startIcon={<EditIcon />} sx={{ width: "auto" }}>
                {t("Edit")}
              </Button>
            </Link>
          )}

          {!isSigned && base64Doc != null && <SignModal base64Doc={base64Doc} onSign={handleSign} />}
        </Box>
      </Box>

      {docUrl && <PDFViewer fileUrl={docUrl} />}

      {!applicationLoading && !prepareLoading && !pdfLoading && !signLoading && !syncLoading && (
        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
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
