import { useState } from "react";
import { useTranslations } from "next-intl";
import { Box, InputLabel, SelectChangeEvent } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import FingerprintScanner from "@/components/ui/FingerprintScanner";
import JacartaSign from "./JacartaSign";

enum SignType {
  Jacarta = "jacarta",
}

const signTypes = Object.entries(SignType).map(([label, value]) => ({ label, value }));

export default function SignModal({ base64Doc, onSign }: { base64Doc: string; onSign: (sign: string) => void }) {
  const t = useTranslations();
  const [state, setState] = useState<"error" | "success" | "primary" | "signed">("primary");
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signType, setSignType] = useState<SignType>();

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
          <Box pb={5}>
            {state === "success" && (
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

            {state === "success" && signType === SignType.Jacarta && (
              <JacartaSign base64Doc={base64Doc} onSign={onSign} />
            )}

            {state !== "success" && (
              <FingerprintScanner
                width="100%"
                loading={loading}
                type={state}
                onClick={() => state === "primary" && handleState()}
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
