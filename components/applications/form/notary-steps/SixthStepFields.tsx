import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import useConvert from "@/hooks/useConvert";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Backdrop, IconButton, Menu } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import Link from "@/components/ui/Link";
import SignModal from "@/components/e-sign/SignModal";
import StepperContentStep from "@/components/ui/StepperContentStep";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import DeclVideoRecordModal from "@/components/decl-video-record/DeclVideoRecordModal";
import KeyIcon from "@mui/icons-material/Key";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useProfileStore } from "@/stores/profile";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function SixthStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const convert = useConvert();
  const profile = useProfileStore((state) => state.getUserData());
  const { trigger, control, watch, setValue } = form;

  const id = watch("id");
  const version = watch("version");

  const [base64Doc, setBase64Doc] = useState<string>();
  const [docUrl, setDocUrl] = useState<string>();
  const [token, setToken] = useState<string>();
  const [isSigned, setIsSigned] = useState(false);
  const [isDeclSigned, setIsDeclSigned] = useState(false);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  // const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<null | HTMLElement>(null);

  const { loading: pdfLoading, update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { data: prepare, loading: prepareLoading, update: getPrepare } = useFetch("", "GET");
  const { loading: syncLoading, update: getSync } = useFetch("", "GET");
  const { update: signDocument, loading } = useFetch("", "POST");
  const { data: application, loading: applicationLoading } = useFetch(
    id != null ? `/api/applications/${id}` : "",
    "POST"
  );

  useEffectOnce(async () => {
    const applicationData = application?.data?.[0];
    let initialLoad = true;

    if (applicationData?.documentInfo?.pdfLink != null && applicationData?.documentInfo?.token != null) {
      setToken(applicationData.documentInfo.token);
      handlePdfDownload(applicationData.documentInfo.pdfLink, applicationData.documentInfo.token);
      initialLoad = false;
    }

    switch (applicationData?.statusSelect) {
      case 1:
        setIsSigned(true);
        handlePrepareDocument();
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

  const handleSign = async (sign: string, callback: Dispatch<SetStateAction<boolean>>) => {
    const signedPdf = await signDocument(`/api/files/sign/${id}`, { hash: sign, haveESP: false });

    if (signedPdf?.data?.pdfLink != null && token != null) {
      await handlePdfDownload(signedPdf.data.pdfLink, token);
      callback(true);
      return true;
    }

    return false;
  };

  const handlePrepareDocument = async (callback?: Dispatch<SetStateAction<boolean>>) => {
    const prepareData = await getPrepare(`/api/files/prepare/${id}`);
    if (prepareData?.data?.saleOrderVersion != null) {
      setValue("version", prepareData.data.saleOrderVersion);
    }

    if (prepareData?.data?.pdfLink != null && prepareData?.data?.token != null) {
      setToken(prepareData.data.token);
      handlePdfDownload(prepareData.data.pdfLink, prepareData.data.token);
    }

    if (callback) callback(false);
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  useEffectOnce(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isBackdropOpen) {
        setIsBackdropOpen(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

  const showSign = profile?.roles.some((role) => role.name === "Trainee" || role.name === "Assistant notary");

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

      <Box display="flex" justifyContent="space-between" gap="20px">
        <StepperContentStep
          step={6}
          title={t("View document")}
          loading={applicationLoading || prepareLoading || pdfLoading || syncLoading}
        />
        <ConfirmationModal
          title="Rebuild the document"
          type="hint"
          hintTitle=""
          hintText={"All changes made earlier in the document will be lost"}
          onConfirm={(callback) => handlePrepareDocument(callback)}
          confirmLoading={prepareLoading}
        >
          <Button startIcon={<SyncIcon />} sx={{ flexGrow: "1" }}>
            {t("Rebuild the document")}
          </Button>
        </ConfirmationModal>
      </Box>

      {docUrl && <PDFViewer fileUrl={docUrl} />}

      <Box
        width="fit-content"
        position="sticky"
        bottom="20px"
        display="flex"
        gap="20px"
        flexDirection={{ xs: "column", md: "row" }}
      >
        {!isSigned && onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button onClick={() => handleNextClick()} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
            {isSigned ? t("Next") : t("Save to draft")}
          </Button>
        )}
        {!isSigned && base64Doc != null && !showSign && (
          <SignModal signLoading={loading} base64Doc={base64Doc} onSign={(sign) => handleSign(sign, setIsSigned)} />
        )}
        {!isSigned && token && (application?.data?.[0]?.documentInfo?.editUrl || prepare?.data?.editUrl != null) && (
          <Link
            href={`${
              application?.data[0]?.documentInfo?.editUrl ?? prepare?.data?.editUrl
            }?AuthorizationBasic=${token.replace(/Basic /, "")}`}
            target="_blank"
            onClick={() => setIsBackdropOpen(true)}
          >
            <Button startIcon={<EditIcon />} sx={{ flexGrow: "1", height: "100%" }}>
              {t("Edit")}
            </Button>
          </Link>
        )}
        {!applicationLoading && !prepareLoading && !pdfLoading && !syncLoading && (
          <Box
            width="fit-content"
            position="sticky"
            bottom="20px"
            display="flex"
            gap="20px"
            flexDirection={{ xs: "column", md: "row" }}
          >
            {!isDeclSigned && base64Doc != null && !showSign && (
              <SignModal
                base64Doc={base64Doc}
                signLoading={loading}
                onSign={async (sign) => handleSign(sign, setIsDeclSigned)}
              >
                <Button startIcon={<KeyIcon />} sx={{ flexGrow: "1" }}>
                  {t("Sign as declarant")}
                </Button>
              </SignModal>
            )}

            {!showSign && (
              <DeclVideoRecordModal applicationId={id as number}>
                <Button startIcon={<VideocamIcon />} sx={{ flexGrow: "1" }}>
                  {t("Record a video")}
                </Button>
              </DeclVideoRecordModal>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
