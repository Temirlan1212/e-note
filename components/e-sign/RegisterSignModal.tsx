import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Box, Collapse, InputLabel, SelectChangeEvent } from "@mui/material";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import JacartaSign, { IJacartaSignRef } from "./JacartaSign";
import RutokenSign, { IRutokenSignRef } from "./RutokenSign";
import InputIcon from "@mui/icons-material/Input";
import useFetch from "@/hooks/useFetch";
import { useProfileStore } from "@/stores/profile";

enum SignType {
  Jacarta = "jacarta",
  Rutoken = "rutoken",
}

const signTypes = Object.entries(SignType).map(([label, value]) => ({ label, value }));

export default function RegisterSignModal() {
  const t = useTranslations();
  const [alertOpen, setAlertOpen] = useState(false);
  const [signType, setSignType] = useState<SignType>();
  const [serialNumber, setSerialNumber] = useState<number | null>(null);
  const profile = useProfileStore((state) => state.getUserData());

  const { update, error } = useFetch("", "PUT");

  const jcRef = useRef<IJacartaSignRef>(null);
  const rtRef = useRef<IRutokenSignRef>(null);

  const handleSign = async (openModal: (open: boolean) => void) => {
    if (profile && signType && serialNumber) {
      const register = await update("/api/sign-register/update", {
        notary: {
          id: profile.activeCompany.id,
        },
        typeOfSignature: signType,
        digitalSignNumber: serialNumber,
      });

      if (register.status == "-1") {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      openModal(false);
    }
  };

  const handleToggle = () => {
    setSignType(undefined);
    setAlertOpen(false);
    setSerialNumber(null);
  };

  return (
    <ConfirmationModal
      title="EDS registration"
      type="hint"
      hintTitle=""
      hintText="You can register an EDS for further use"
      slots={{
        button: (callback) => (
          <Box width="100%">
            <Button disabled={!signType} onClick={() => handleSign(callback)}>
              {t("Register")}
            </Button>
          </Box>
        ),
        body: () => (
          <Box pb={5} sx={{ maxHeight: { xs: "300px", md: "unset" }, overflowY: { xs: "scroll", md: "unset" } }}>
            <Collapse in={alertOpen}>
              <Alert severity="warning" onClose={() => setAlertOpen(false)}>
                {t("This action failed")}
              </Alert>
            </Collapse>

            <Box display="flex" flexDirection="column" my={2}>
              <InputLabel>{t("Type")}</InputLabel>
              <Select
                data={signTypes}
                onChange={(event: SelectChangeEvent<SignType>) => {
                  setSignType(event.target.value as SignType);
                  setAlertOpen(false);
                  setSerialNumber(null);
                }}
              />
            </Box>

            {signType === SignType.Jacarta && (
              <JacartaSign
                onlyDevice={true}
                getSerialNumber={(serialNumber) => setSerialNumber(serialNumber)}
                base64Doc=""
                ref={jcRef}
              />
            )}

            {signType === SignType.Rutoken && (
              <RutokenSign
                onlyDevice={true}
                getSerialNumber={(serialNumber) => setSerialNumber(serialNumber)}
                base64Doc=""
                ref={rtRef}
              />
            )}
          </Box>
        ),
      }}
      onToggle={handleToggle}
    >
      <Button startIcon={<InputIcon />} sx={{ flexGrow: "1" }}>
        {t("Register an EDS")}
      </Button>
    </ConfirmationModal>
  );
}
