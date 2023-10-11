import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Box, Collapse, InputLabel, SelectChangeEvent, Typography } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import FingerprintScanner from "@/components/ui/FingerprintScanner";
import JacartaSign, { IJacartaSignRef } from "./JacartaSign";
import RutokenSign, { IRutokenSignRef } from "./RutokenSign";
import FaceIdScanner from "@/components/face-id/faceId";

enum SignType {
  Jacarta = "jacarta",
  Rutoken = "rutoken",
}

const signTypes = Object.entries(SignType).map(([label, value]) => ({ label, value }));

export default function SignModal({ base64Doc, onSign }: { base64Doc: string; onSign: (sign: string) => void }) {
  const t = useTranslations();
  const [fingerScanner, setFingerScanner] = useState<"error" | "success" | "primary" | "signed">("primary");
  const [faceIdScanner, setFaceIdScanner] = useState(false);
  const [openTab, setOpenTab] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [signType, setSignType] = useState<SignType>();

  const jcRef = useRef<IJacartaSignRef>(null);
  const rtRef = useRef<IRutokenSignRef>(null);

  const handleState = () => {
    setLoading(true);
    new Promise((resolve) => setTimeout(resolve, 1000, "success"))
      .then((value) => setFingerScanner(value as typeof fingerScanner))
      .finally(() => setLoading(false));
  };

  const handleSign = async (openModal: (open: boolean) => void) => {
    const signRefCurrent = jcRef.current ?? rtRef.current;
    if (signRefCurrent == null) return;

    try {
      const sign = await signRefCurrent?.handleSign(onSign);
      if (sign == null) {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      setIsSigned(true);
      setFingerScanner("signed");
      openModal(false);
    } catch (e: any) {
      setAlertOpen(true);
    }
  };

  const handleToggle = () => {
    setFingerScanner("primary");
    setIsSigned(false);
    setSignType(undefined);
    setAlertOpen(false);
  };

  const handleToggleTab = () => {
    if (fingerScanner === "success" || faceIdScanner) {
      return;
    }
    setOpenTab((prevState) => !prevState);
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
            {!isSigned && fingerScanner !== "error" && (
              <Button disabled={fingerScanner !== "success"} onClick={() => handleSign(callback)}>
                {t("Sign")}
              </Button>
            )}

            {fingerScanner === "error" && (
              <Button disabled={fingerScanner !== "error"} onClick={handleState}>
                {t("Try again")}
              </Button>
            )}
          </Box>
        ),
        body: () => (
          <Box pb={5}>
            <Typography marginBottom="20px" align="center" fontSize={{ xs: "16px", sm: "20px" }} fontWeight={600}>
              {t("Confirmation of identity")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <Button
                sx={{
                  fontSize: { xs: "14px", sm: "16px" },
                  "&:hover": {
                    color: "white",
                  },
                }}
                variant={!openTab ? "contained" : "outlined"}
                onClick={handleToggleTab}
              >
                {t("By fingerprint")}
              </Button>
              <Button
                sx={{
                  fontSize: { xs: "14px", sm: "16px" },
                  "&:hover": {
                    color: "white",
                  },
                }}
                variant={openTab ? "contained" : "outlined"}
                onClick={handleToggleTab}
              >
                {t("By face id")}
              </Button>
            </Box>
            <Collapse in={alertOpen}>
              <Alert severity="warning" onClose={() => setAlertOpen(false)}>
                {t("This action failed")}
              </Alert>
            </Collapse>

            {(fingerScanner === "success" || faceIdScanner) && (
              <Box display="flex" flexDirection="column" my={2}>
                <InputLabel>{t("Type")}</InputLabel>
                <Select
                  data={signTypes}
                  onChange={(event: SelectChangeEvent<SignType>) => {
                    setSignType(event.target.value as SignType);
                    setAlertOpen(false);
                  }}
                />
              </Box>
            )}

            {(fingerScanner === "success" || faceIdScanner) && signType === SignType.Jacarta && (
              <JacartaSign base64Doc={base64Doc} ref={jcRef} />
            )}

            {(fingerScanner === "success" || faceIdScanner) && signType === SignType.Rutoken && (
              <RutokenSign base64Doc={base64Doc} ref={rtRef} />
            )}

            {!openTab && fingerScanner !== "success" && (
              <FingerprintScanner
                width="100%"
                loading={loading}
                type={fingerScanner}
                onClick={() => fingerScanner === "primary" && handleState()}
              />
            )}

            {openTab && !faceIdScanner && <FaceIdScanner getStatus={(status) => setFaceIdScanner(status)} />}
          </Box>
        ),
      }}
      onToggle={handleToggle}
    >
      <Button startIcon={<KeyIcon />} sx={{ width: "auto" }}>
        {t("Sign")}
      </Button>
    </ConfirmationModal>
  );
}
