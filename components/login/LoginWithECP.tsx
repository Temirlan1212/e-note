import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Box, Collapse, InputLabel, SelectChangeEvent } from "@mui/material";

import useFetch from "@/hooks/useFetch";

import JacartaSign, { IJacartaSignRef } from "@/components/e-sign/JacartaSign";
import RutokenSign, { IRutokenSignRef } from "@/components/e-sign/RutokenSign";

import Button from "../ui/Button";
import Select from "../ui/Select";
import { useRouter } from "next/router";
import { useProfileStore } from "@/stores/profile";

enum SignType {
  Jacarta = "jacarta",
  Rutoken = "rutoken",
}

const signTypes = Object.entries(SignType).map(([label, value]) => ({ label, value }));

const LoginWithECP: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();

  const [signType, setSignType] = useState<SignType>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState<string>("This action failed");

  const jcRef = useRef<IJacartaSignRef>(null);
  const rtRef = useRef<IRutokenSignRef>(null);

  const { loading, update } = useFetch("", "POST");
  const profile = useProfileStore((state) => state);

  const onSign = async (sign: string) => {
    if (sign) {
      const data = await update("/api/profile/eds-login", {
        hash: sign,
      });
      await profile.logInEds(sign);

      if (!data) {
        setAlertText("User is not registered in the system");
        setAlertOpen(true);
      }
    }
    return false;
  };

  const handleSign = async () => {
    const signRefCurrent = jcRef.current ?? rtRef.current;
    if (signRefCurrent == null) return;

    try {
      const signed = await signRefCurrent?.handleSign(onSign);
      // if (signed) {
      //   setAlertOpen(true);
      //   return;
      // }

      setAlertOpen(false);
    } catch (e: any) {
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Collapse in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t(alertText)}
        </Alert>
      </Collapse>
      <Box display="flex" flexDirection="column" my={2}>
        <InputLabel>{t("Type")}</InputLabel>
        <Select
          data={signTypes}
          onChange={(event: SelectChangeEvent<SignType>) => {
            setSignType(event.target.value as SignType);
          }}
        />

        {signType === SignType.Jacarta && <JacartaSign base64Doc="sign" ref={jcRef} />}

        {signType === SignType.Rutoken && <RutokenSign base64Doc="sign" ref={rtRef} />}
      </Box>
      <Button loading={loading} onClick={handleSign}>
        {t("Login")}
      </Button>
    </>
  );
};

export default LoginWithECP;
