import * as React from "react";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Box } from "@mui/material";
import Accordion from "../ui/Accordion";
import LoginAndPasswordForm from "./LoginAndPasswordForm";
import LoginWithESI from "./LoginWithESI/LoginWithESI";
import LoginWithECP from "./LoginWithECP";

const loginTypesData = [
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

export default function LoginAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>(loginTypesData[0].type);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
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
  );
}
