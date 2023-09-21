import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import useFetch from "@/hooks/useFetch";

interface IRecaptchaProps {
  onRecaptchaSuccess: (success: boolean) => void;
}
const Recaptcha: React.FC<IRecaptchaProps> = ({ onRecaptchaSuccess }) => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const { locale } = useRouter();

  const { update: checkRecaptcha } = useFetch("", "POST");

  const handleRecaptchaChange = (token: string | null) => {
    checkRecaptcha("/api/recaptcha", { token: token }).then((data) => onRecaptchaSuccess(data.success));
  };

  return (
    <ReCAPTCHA
      sitekey={process.env.RECAPTCHA_PUBLIC_KEY as string}
      ref={recaptchaRef}
      hl={locale === "kg" ? "ru" : locale}
      onChange={handleRecaptchaChange}
    />
  );
};

export default Recaptcha;
