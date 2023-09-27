import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, InputLabel, SelectChangeEvent } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import FingerprintScanner from "@/components/ui/FingerprintScanner";
import JacartaSign, { IJacartaSignRef } from "./JacartaSign";

enum SignType {
  Jacarta = "jacarta",
}

const signTypes = Object.entries(SignType).map(([label, value]) => ({ label, value }));

export default function SignModal({ base64Doc, onSign }: { base64Doc: string; onSign: (sign: string) => void }) {
  const t = useTranslations();
  const [fingerScanner, setFingerScanner] = useState<"error" | "success" | "primary" | "signed">("primary");
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signType, setSignType] = useState<SignType>();

  const jcRef = useRef<IJacartaSignRef>(null);

  const handleState = () => {
    setLoading(true);
    new Promise((resolve) => setTimeout(resolve, 1000, "success"))
      .then((value) => setFingerScanner(value as typeof fingerScanner))
      .finally(() => setLoading(false));
  };

  const handleSign = (openModal: (open: boolean) => void) => {
    if (jcRef == null) return;

    const sign = jcRef.current?.handleSign(onSign);
    if (sign) {
      setIsSigned(true);
      setFingerScanner("signed");
      openModal(false);
    }
  };

  const handleToggle = () => {
    setFingerScanner("primary");
    setIsSigned(false);
    setSignType(undefined);
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
            {fingerScanner === "success" && (
              <Box display="flex" flexDirection="column" my={2}>
                <InputLabel>{t("Type")}</InputLabel>
                <Select
                  data={signTypes}
                  onChange={(event: SelectChangeEvent<SignType>) => {
                    setSignType(event.target.value as SignType);
                  }}
                />
              </Box>
            )}

            {fingerScanner === "success" && signType === SignType.Jacarta && (
              <JacartaSign base64Doc={base64Doc} ref={jcRef} />
            )}

            {fingerScanner !== "success" && (
              <FingerprintScanner
                width="100%"
                loading={loading}
                type={fingerScanner}
                onClick={() => fingerScanner === "primary" && handleState()}
              />
            )}
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