import { useState } from "react";
import { useTranslations } from "next-intl";

import { Box } from "@mui/material";
import Button from "@/components/ui/Button";
import CreateIcon from "@mui/icons-material/Create";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import FingerprintScanner from "@/components/ui/FingerprintScanner";

export default function SignModal() {
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
}
