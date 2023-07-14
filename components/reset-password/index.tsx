import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import EmailForm from "./EmailForm";
import NewPasswordForm from "./NewPasswordForm";
import SuccessForm from "./SuccessForm";

const ResetPassword = () => {
  const t = useTranslations();
  const [step, setStep] = useState(1);

  return (
    <Box py={5}>
      <Typography variant="h1" fontWeight={600} my={6} textAlign={"center"}>
        {t("Reset Password")}
      </Typography>
      <Box
        sx={{
          padding: "30px 20px",
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 5px 20px 0px #E9E9E9",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {step === 1 ? <EmailForm /> : step === 2 ? <NewPasswordForm /> : <SuccessForm />}
      </Box>
    </Box>
  );
};

export default ResetPassword;
