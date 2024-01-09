import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import useFetch from "@/hooks/useFetch";
import { useProfileStore } from "@/stores/profile";
import Checkbox from "@/components/ui/Checkbox";
import { useState } from "react";

export default function AgreementPersonalDataModal({ onSubmit }: { onSubmit?: (agreement: boolean) => void }) {
  const t = useTranslations();
  const [dontShowAnymore, setDontShowAnymore] = useState(false);
  const loadUserData = useProfileStore((state) => state.loadUserData);
  const logOut = useProfileStore((state) => state.logOut);
  const setAgreementPersonalData = useProfileStore((state) => state.setAgreementPersonalData);
  const agreementPersonalData = useProfileStore((state) => state.agreementPersonalData);
  const userData = useProfileStore((state) => state.userData);

  const { loading, update } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const updateAgreementPersonalData = async (agreement: boolean) => {
    if (userData == null) return;
    const params = {
      id: userData?.id,
      version: userData?.version,
      agreementPersonalData: agreement,
      showPersonalAgreement: !dontShowAnymore,
    };
    await update("/api/profile/update/" + userData?.id, {
      body: params,
    }).then((res) => {
      if (res && res.ok && agreement) {
        loadUserData({
          username: userData?.code,
        });
      }
    });

    if (agreement) setAgreementPersonalData(agreement);
    if (!agreement) logOut();

    onSubmit && onSubmit(agreement);
  };

  const handleDontShowAnymoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAnymore(event.target.checked);
  };

  return (
    <ConfirmationModal
      isPermanentOpen={agreementPersonalData === null ? true : false}
      title="The electronic Notary of the Kyrgyz Republic requests your permission"
      isHintShown={false}
      slots={{
        body: () => (
          <Box>
            <PDFViewer
              fileUrl="./documents/consentOfCitizen.pdf"
              props={{ workerBox: { height: "50vh", overflow: "auto" } }}
            />
            <Checkbox
              label={t("Don't show it anymore")}
              checked={dontShowAnymore}
              onChange={handleDontShowAnymoreChange}
            />
          </Box>
        ),
        button: () => (
          <Box display="flex" alignItems="center" justifyContent="center" gap="16px" width="100%">
            <>
              <Button onClick={() => updateAgreementPersonalData(true)} loading={loading}>
                {t("Allow collection")}
              </Button>
              <Button onClick={() => updateAgreementPersonalData(false)} buttonType="danger" loading={loading}>
                {t("Do not allow collection")}
              </Button>
            </>
          </Box>
        ),
      }}
    />
  );
}
