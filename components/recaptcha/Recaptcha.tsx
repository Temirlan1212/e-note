import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

interface IRecaptchaProps {
  onRecaptchaSuccess: (success: boolean) => void;
}
const Recaptcha: React.FC<IRecaptchaProps> = ({ onRecaptchaSuccess }) => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [publicSiteKey, setPublicSiteKey] = useState<string | null>(null);
  const { locale } = useRouter();

  const { update } = useFetch("", "POST");
  const { data: getKeyData, update: getKey } = useFetch("", "POST");

  const handleRecaptchaChange = async (token: string | null) => {
    await update("/api/recaptcha", { token: token }).then((data) => onRecaptchaSuccess(data.success));
  };

  useEffectOnce(async () => {
    await getKey("/api/recaptcha", { requestType: "getPublicKey" }).then((getKeyData) => setPublicSiteKey(getKeyData));
  });

  return (
    <>
      {publicSiteKey && (
        <ReCAPTCHA
          sitekey={publicSiteKey as string}
          ref={recaptchaRef}
          hl={locale === "kg" ? "ru" : locale}
          onChange={handleRecaptchaChange}
        />
      )}
    </>
  );
};

export default Recaptcha;
