import React, { useState } from "react";
import { Box, IconButton, InputAdornment, ToggleButtonGroup } from "@mui/material";
import Hint from "../../ui/Hint";
import Link from "../../ui/Link";
import { useTranslations } from "next-intl";
import ToggleButton from "../../ui/ToggleButton";
import Input from "../../ui/Input";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Button from "../../ui/Button";
import LoginWithINN from "./LoginWithINN";
import LoginWithID from "./LoginWithID";

const LoginWithESI: React.FC = () => {
  const t = useTranslations();

  const [loginType, setLoginType] = useState<string | null>("INN");

  const handleLoginType = (event: React.MouseEvent<HTMLElement>, loginType: string | null) => {
    loginType && setLoginType(loginType);
  };

  return (
    <Box>
      {loginType === "INN" && (
        <Hint type="hint" sx={{ mb: "30px" }}>
          {t("To enter through the ESI you need to contact the nearest ")}
          <Link sx={{ textDecoration: "underline" }} color="success.main" href={"#"}>
            {t("PSC")}
          </Link>{" "}
          {t("or to any notary in ")}
          <Link sx={{ textDecoration: "underline" }} color="success.main" href={"#"}>
            {t("registry")}
          </Link>{" "}
          {t("to get a login-password and log in using the login-password")}.
        </Hint>
      )}
      <ToggleButtonGroup
        sx={{ gap: "20px", width: "100%", mb: "30px" }}
        value={loginType}
        exclusive
        onChange={handleLoginType}
      >
        <ToggleButton value="INN">{t("Login with TIN")}</ToggleButton>
        <ToggleButton value="ID">{t("Login with ID")}</ToggleButton>
      </ToggleButtonGroup>

      {loginType === "INN" ? <LoginWithINN /> : <LoginWithID />}
    </Box>
  );
};

export default LoginWithESI;
