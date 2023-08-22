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
import CreateIcon from "@mui/icons-material/Create";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import FingerprintScanner from "@/components/ui/FingerprintScanner";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

export default function SixthStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
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
      <Box display="flex" gap="10px" justifyContent="flex-end">
        <Box display="flex" justifyContent="end">
          <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
            {t("Download PDF")}
          </Button>
        </Box>

        <SignModal />
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
  );
}

const SignModal = () => {
  const [state, setState] = useState<"error" | "success" | "primary" | "signed">("primary");
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const handleState = () => {
    setLoading(true);
    new Promise((resolve) => setTimeout(resolve, 1000, "success"))
      .then((value) => setState(value as typeof state))
      .finally(() => setLoading(false));
  };

  const handleSign = () => {
    setIsSigned(true);
    setState("signed");
  };

  const handleToggle = () => {
    setState("primary");
    setIsSigned(false);
  };

  const handleAssignUniqueNumber = (callback: Function) => {
    callback(false);
  };

  return (
    <ConfirmationModal
      title="Entry into the register"
      type="hint"
      hintTitle=""
      hintText={
        "To enter a document into the registry and assign a unique document number, you need confirmation of your fingerprints and your EDS"
      }
      slots={{
        button: (callback) => (
          <Box width="100%">
            {!isSigned && state !== "error" && (
              <Button disabled={state !== "success"} onClick={handleSign}>
                {t("Sign")}
              </Button>
            )}

            {state === "error" && (
              <Button disabled={state !== "error"} onClick={handleState}>
                {t("Try again")}
              </Button>
            )}

            {isSigned && (
              <Button onClick={() => handleAssignUniqueNumber(callback)}>
                {t("Assign a unique number and enter it in the registry")}
              </Button>
            )}
          </Box>
        ),
        body: () => (
          <Box pb="50px">
            <FingerprintScanner
              width="100%"
              loading={loading}
              type={state}
              onClick={() => state === "primary" && handleState()}
            />
          </Box>
        ),
      }}
      onToggle={handleToggle}
    >
      <Button startIcon={<CreateIcon />} sx={{ width: "auto" }}>
        {t("Sign")}
      </Button>
    </ConfirmationModal>
  );
};
