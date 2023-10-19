import * as React from "react";

import KeyIcon from "@mui/icons-material/Key";
import StorageIcon from "@mui/icons-material/Storage";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import { Box, Typography } from "@mui/material";
import Accordion from "../ui/Accordion";
import LoginAndPasswordForm from "./LoginAndPasswordForm";
import LoginWithESI from "./LoginWithESI";
import LoginWithECP from "./LoginWithECP";
import { useTranslations } from "next-intl";
import LoginWithFingerprint from "./LoginWithFingerprint";

const loginTypesData = [
  {
    title: "Login with login and password",
    icon: PersonOutlineOutlinedIcon,
    type: "login-pass",
    content: LoginAndPasswordForm,
  },
  {
    title: "Login via ESI",
    icon: StorageIcon,
    type: "ESI",
    content: LoginWithESI,
  },
  // {
  //   title: "Login via EDS",
  //   icon: KeyIcon,
  //   type: "ECP",
  //   content: LoginWithECP,
  // },
  // {
  //   title: "Fingerprint Login",
  //   icon: FingerprintOutlinedIcon,
  //   type: "fingerprint",
  //   content: LoginWithFingerprint,
  // },
];

interface ILoginAccordionProps {}

export default function LoginAccordion({}: ILoginAccordionProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState<string | false>(loginTypesData[0].type);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box py={5}>
      <Typography variant="h1" fontWeight={600} my={6} textAlign={"center"}>
        {t("Login to your personal account")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "30px", maxWidth: "520px", margin: "0 auto" }}>
        {loginTypesData.map(({ title, icon: Icon, type, content: Content }) => (
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
