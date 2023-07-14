import * as React from "react";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Box, Typography } from "@mui/material";
import Accordion from "../ui/Accordion";
import LoginAndPasswordForm from "./LoginAndPasswordForm";
import LoginWithESI from "./LoginWithESI/LoginWithESI";
import LoginWithECP from "./LoginWithECP";
import { useTranslations } from "next-intl";
import LoginWithFingerprint from "./LoginWithFingerprint";

const userLoginTypesData = [
  {
    title: "Login with login and password",
    icon: PersonOutlineOutlinedIcon,
    type: "login-pass",
    content: LoginAndPasswordForm,
  },
  {
    title: "Login via EDS",
    icon: FingerprintOutlinedIcon,
    type: "ECP",
    content: LoginWithESI,
  },
  {
    title: "Login via ESI",
    icon: InsertDriveFileOutlinedIcon,
    type: "ESI",
    content: LoginWithECP,
  },
];

const notaryLoginTypesData = [
  {
    title: "Login with login and password",
    icon: PersonOutlineOutlinedIcon,
    type: "login-pass",
    content: LoginAndPasswordForm,
  },
  {
    title: "Login via EDS",
    icon: InsertDriveFileOutlinedIcon,
    type: "ECP",
    content: LoginWithECP,
  },
  {
    title: "Fingerprint Login",
    icon: FingerprintOutlinedIcon,
    type: "fingerprint",
    content: LoginWithFingerprint,
  },
];

interface ILoginAccordionProps {
  role: "user" | "notary";
}

export default function LoginAccordion({ role }: ILoginAccordionProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState<string | false>(userLoginTypesData[0].type);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isNotary = role === "notary";

  function switchData() {
    if (isNotary) {
      return notaryLoginTypesData;
    } else {
      return userLoginTypesData;
    }
  }

  return (
    <Box py={5}>
      <Typography variant="h1" fontWeight={600} my={6} textAlign={"center"}>
        {isNotary ? t("Login to the personal account of the Notary") : t("Login to your personal account")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "30px", maxWidth: "520px", margin: "0 auto" }}>
        {switchData().map(({ title, icon: Icon, type, content: Content }) => (
          <Accordion
            key={title}
            expanded={expanded === type}
            title={title}
            icon={Icon}
            type={type}
            handleChange={handleChange(type)}
          >
            <Content />
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
