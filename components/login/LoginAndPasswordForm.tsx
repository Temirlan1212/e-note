import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Link from "../ui/Link";

const LoginAndPasswordForm: React.FC = () => {
  const t = useTranslations();
  return (
    <Box>
      <Hint type="hint" sx={{ mb: "20px" }}>
        {t("To log in with a username and password, you need to register with the ESI") +
          ". " +
          t("In order to receive an ESI, you need to contact the nearest")}{" "}
        <Link sx={{ textDecoration: "underline" }} color="success.main" href={"#"}>
          {t("PSC")}
        </Link>{" "}
        {t("or to any notary in ")}
        <Link sx={{ textDecoration: "underline" }} color="success.main" href={"#"}>
          {t("in registry")}
        </Link>{" "}
        {t("to get a login")}.
      </Hint>

      <Link sx={{ textDecoration: "underline" }} color="#24334B" href="/reset-password">
        {t("Forgot password")}
      </Link>

      {/* <form>

      </form> */}
    </Box>
  );
};

export default LoginAndPasswordForm;
