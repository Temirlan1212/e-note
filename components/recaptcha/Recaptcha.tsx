import React, { useRef } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import useFetch from "@/hooks/useFetch";

interface IRecaptchaProps {
  onRecaptchaSuccess: (success: boolean) => void;
}
const Recaptcha: React.FC<IRecaptchaProps> = ({ onRecaptchaSuccess }) => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const { locale } = useRouter();

  const { update } = useFetch("", "POST");

  const handleRecaptchaChange = async (token: string | null) => {
    await update("/api/recaptcha", { token: token }).then((data) => onRecaptchaSuccess(data.success));
  };

  return (
    <ReCAPTCHA
      sitekey="6LdZVBwoAAAAAFjhQbUlEdfpyrz5HT9LPQyHhfGr"
      ref={recaptchaRef}
      hl={locale === "kg" ? "ru" : locale}
      onChange={handleRecaptchaChange}
    />
  );
};

export default Recaptcha;
