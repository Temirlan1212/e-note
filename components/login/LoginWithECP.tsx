import { Box } from "@mui/material";

import Hint from "../ui/Hint";
import Link from "../ui/Link";
import { useTranslations } from "next-intl";

const LoginWithECP: React.FC = () => {
  const t = useTranslations();
  return (
    <Box>
      <Hint title="Extension “Adapter Rutoken Plugin” is not installed" type="error">
        {t("You can download it from ")}
        <Link sx={{ textDecoration: "underline" }} color="success.main" href={"#"}>
          {t("this link")}
        </Link>
      </Hint>
    </Box>
  );
};

export default LoginWithECP;
