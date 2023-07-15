import { Box, IconButton, InputAdornment } from "@mui/material";
import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Link from "../ui/Link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginAndPasswordForm: React.FC = () => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
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

      <Box component="form" onSubmit={(e) => e.preventDefault()}>
        <Box display="flex" flexDirection="column" gap="20px">
          <Input
            label={t("Username")}
            variant="outlined"
            color="success"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            name="username"
          />

          <Input
            type={showPassword ? "text" : "password"}
            label={t("Password")}
            variant="outlined"
            color="success"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff color="success" /> : <Visibility color="success" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            name="password"
          />
          <Link sx={{ textDecoration: "underline" }} color="#24334B" href="/reset-password">
            {t("Forgot password")}
          </Link>

          <Button type="submit" sx={{ padding: "10px 0", width: "100%", mt: "10px" }} fullWidth color="success">
            {t("Enter")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginAndPasswordForm;
