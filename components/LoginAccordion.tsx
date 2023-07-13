import * as React from "react";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Box, ToggleButton as MuiToggleButton, ToggleButtonGroup, ToggleButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import Hint from "./ui/Hint";
import Accordion from "./ui/Accordion";
import Link from "./ui/Link";
import { useTranslations } from "next-intl";

const LoginAndPasswordForm: React.FC = () => {
  const t = useTranslations();
  return (
    <Box>
      <Hint
        links={[
          { title: "ЦОН", href: "#" },
          { title: "в реестре", href: "#" },
        ]}
        text="Чтобы войти через логин и пароль вам необходимо зарегистрироваться в ЕСИ. Для того, чтобы получить ЕСИ вам необходимо обратиться в ближайший * или к любому нотариусу * для получения логина."
        type="hint"
        sx={{ mb: "20px" }}
      />

      <Link sx={{ textDecoration: "underline" }} color="#24334B" href="/reset-password">
        {t("Forgot password")}
      </Link>

      {/* <form>

      </form> */}
    </Box>
  );
};

const ToggleButton = styled((props: ToggleButtonProps) => <MuiToggleButton {...props} />)(({ theme }) => ({
  border: "none",
  fontSize: "16px",
  width: "100%",
  borderRadius: "0",

  "&:hover": {
    backgroundColor: theme.palette.text.secondary,
  },

  "&.Mui-selected": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.text.secondary,
    boxShadow: "0px 10px 20px 0px #99DBAF",
  },
  "&.Mui-selected:hover": {
    backgroundColor: theme.palette.success.main,
  },
}));

const LoginWithESI: React.FC = () => {
  const t = useTranslations();
  const [loginType, setLoginType] = React.useState<string | null>("INN");

  const handleLoginType = (event: React.MouseEvent<HTMLElement>, loginType: string | null) => {
    loginType && setLoginType(loginType);
  };
  return (
    <Box>
      {loginType === "INN" && (
        <Hint
          type="hint"
          text="Чтобы войти через ЕСИ вам необходимо обратиться в ближайший * или к любому нотариусу в * для получения логина-пароля и зайти через логин-пароль."
          links={[
            { title: "ЦОН", href: "#" },
            { title: "реестре", href: "#" },
          ]}
          sx={{ mb: "30px" }}
        />
      )}
      <ToggleButtonGroup
        sx={{ gap: "20px", width: "100%", mb: "30px" }}
        value={loginType}
        exclusive
        onChange={handleLoginType}
      >
        <ToggleButton value="INN">{t("Вход через ИНН")}</ToggleButton>
        <ToggleButton value="ID">{t("Вход через ID")}</ToggleButton>
      </ToggleButtonGroup>

      {loginType === "ID" && (
        <>
          <Link href="#" color="success.main" sx={{ textDecoration: "underline", marginTop: "20px" }}>
            {t("Инструкция для подключения к e-ID карте")}
          </Link>
          <Hint
            sx={{ mt: "30px" }}
            type="hint"
            text="ID-карта - это внутренний паспорт (айди карта) гражданина Кыргызской Республики."
          />
        </>
      )}
    </Box>
  );
};

const LoginWithECP: React.FC = () => {
  return (
    <Box>
      <Hint
        title="Расширение “Адаптер Рутокен Плагин” не установлено"
        text="Вы можете скачать его по *"
        links={[{ title: "этой ссылке", href: "#" }]}
        type="error"
      />
    </Box>
  );
};

const loginTypesData = [
  {
    title: "Вход через логин и пароль",
    icon: PersonOutlineOutlinedIcon,
    type: "login-pass",
    content: LoginAndPasswordForm,
  },
  {
    title: "Вход посредством ЭЦП",
    icon: FingerprintOutlinedIcon,
    type: "ECP",
    content: LoginWithESI,
  },
  {
    title: "Вход через ЕСИ",
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
          handleChange={handleChange}
        >
          <Content />
        </Accordion>
      ))}
    </Box>
  );
}
