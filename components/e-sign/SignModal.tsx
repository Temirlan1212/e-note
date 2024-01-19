import { PropsWithChildren, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Box, Collapse, InputLabel, SelectChangeEvent, Typography } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import JacartaSign, { IJacartaSignRef } from "./JacartaSign";
import RutokenSign, { IRutokenSignRef } from "./RutokenSign";
import FaceIdScanner from "@/components/face-id/FaceId";
// import { useProfileStore } from "@/stores/profile";

enum SignType {
  Jacarta = "jacarta",
  Rutoken = "rutoken",
}

const signTypes = Object.entries(SignType).map(([label, value]) => ({ label, value }));

export default function SignModal({
  base64Doc,
  onSign,
  children,
  signLoading,
}: PropsWithChildren<{
  base64Doc: string;
  onSign: (sign: string) => Promise<boolean>;
  signLoading?: boolean;
}>) {
  const t = useTranslations();
  const [isSigned, setIsSigned] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [signType, setSignType] = useState<SignType>();
  const [faceIdScanner, setFaceIdScanner] = useState(false);
  // const profile = useProfileStore.getState()?.userData;

  const jcRef = useRef<IJacartaSignRef>(null);
  const rtRef = useRef<IRutokenSignRef>(null);

  const handleSign = async (openModal: (open: boolean) => void) => {
    const signRefCurrent = jcRef.current ?? rtRef.current;
    if (signRefCurrent == null) return;

    try {
      const signed = await signRefCurrent?.handleSign(onSign);
      if (!signed) {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      setIsSigned(true);
      openModal(false);
    } catch (e: any) {
      setAlertOpen(true);
    }
  };

  const handleToggle = () => {
    setIsSigned(false);
    setSignType(undefined);
    setAlertOpen(false);
    setFaceIdScanner(false);
  };

  return (
    <ConfirmationModal
      title="Entry into the register"
      type="hint"
      hintTitle=""
      hintText={faceIdScanner ? "Eds hint text" : "Face id hint text"}
      slots={{
        button: (callback) => (
          <Box width="100%">
            <Button loading={signLoading} disabled={!faceIdScanner} onClick={() => handleSign(callback)}>
              {t("Sign")}
            </Button>
          </Box>
        ),
        body: () => (
          <Box pb={3} sx={{ maxHeight: { xs: "300px", md: "unset" }, overflowY: { xs: "auto", md: "unset" } }}>
            {!faceIdScanner && (
              <Typography align="center" fontSize={{ xs: "16px", sm: "20px" }} fontWeight={600}>
                {t("Confirmation of identity")}
              </Typography>
            )}
            <Collapse in={alertOpen}>
              <Alert severity="warning" onClose={() => setAlertOpen(false)}>
                {t("This action failed")}
              </Alert>
            </Collapse>

            {faceIdScanner && (
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

            {faceIdScanner && signType === SignType.Jacarta && <JacartaSign base64Doc={base64Doc} ref={jcRef} />}

            {faceIdScanner && signType === SignType.Rutoken && <RutokenSign base64Doc={base64Doc} ref={rtRef} />}

            {!faceIdScanner && <FaceIdScanner getStatus={(status) => setFaceIdScanner(status)} />}

            {faceIdScanner && (
              // profile?.["activeCompany.typeOfNotary"] === "state" &&
              <Button onClick={() => onSign("sign")} loading={signLoading}>
                {t("Without EDS")}
              </Button>
            )}

            {!faceIdScanner && (
              <Button onClick={() => setFaceIdScanner(true)} loading={signLoading}>
                {t("Without Face ID")}
              </Button>
            )}
          </Box>
        ),
      }}
      onToggle={handleToggle}
    >
      <>
        {!children ? (
          <Button startIcon={<KeyIcon />} sx={{ flexGrow: "1" }}>
            {t("Sign")}
          </Button>
        ) : (
          children
        )}
      </>
    </ConfirmationModal>
  );
}
