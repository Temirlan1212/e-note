import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import useFetch from "@/hooks/useFetch";
import { CircularProgress } from "@mui/material";

interface IRecaptchaProps {
  onRecaptchaSuccess: (success: boolean) => void;
}
const Recaptcha: React.FC<IRecaptchaProps> = ({ onRecaptchaSuccess }) => {
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const { locale } = useRouter();

  const { update: checkRecaptcha } = useFetch("", "POST");

  const handleRecaptchaChange = (token: string | null) => {
    setLoading(true);
    checkRecaptcha("/api/recaptcha", { token: token })
      .then((data) => onRecaptchaSuccess(data.success))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
        <>
          {loading && <CircularProgress />}
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
            ref={recaptchaRef}
            hl={locale === "kg" ? "ru" : locale}
            style={{ display: loading ? "none" : "unset" }}
            onChange={handleRecaptchaChange}
          />
        </>
      )}
    </>
  );
};

export default Recaptcha;
