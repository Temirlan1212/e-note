import React, { useState } from "react";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box } from "@mui/material";
import Hint from "../ui/Hint";
import Link from "../ui/Link";
import Button from "../ui/Button";

const LoginWithESI: React.FC = () => {
  const t = useTranslations();

  const { loading, update } = useFetch("", "GET");

  const handleLogin = async () => {
    const data = await update("/api/profile/esi-login/esi-link");
    if (data?.data?.url != null && document != null) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = data.data.url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Box>
      <Hint type="hint" sx={{ mb: "30px" }}>
        {t("To enter through the ESI you need to contact the nearest ")}
        <Link
          sx={{ textDecoration: "underline" }}
          color="success.main"
          target="_blank"
          href="https://grs.gov.kg/ru/subord/drnags/462-tsientry-obsluzhivaniia-nasielieniia/"
        >
          {t("PSC")}
        </Link>{" "}
        {t("to get a login-password and log in using the login-password")}.
      </Hint>

      <Button loading={loading} onClick={handleLogin}>
        {t("Enter")}
      </Button>
    </Box>
  );
};

export default LoginWithESI;
