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

  const { update: checkRecaptcha } = useFetch("", "POST");
  const { data: recaptchaKey, update: getRecaptchaKey } = useFetch("", "POST");

  const handleRecaptchaChange = (token: string | null) => {
    checkRecaptcha("/api/recaptcha", { token: token }).then((data) => onRecaptchaSuccess(data.success));
  };

  useEffectOnce(() => {
    getRecaptchaKey("/api/recaptcha", { requestType: "getPublicKey" }).then((recaptchaKey) =>
      setPublicSiteKey(recaptchaKey)
    );
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
