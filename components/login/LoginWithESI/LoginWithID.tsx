import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import Input from "@/components/ui/Input";
import Link from "@/components/ui/Link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const LoginWithID = () => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box component="form" onSubmit={(e) => e.preventDefault()}>
      <Box display="flex" flexDirection="column" gap="20px">
        <Input
          placeholder="4321"
          type={showPassword ? "text" : "password"}
          label={t("Passport password")}
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
        <Link href="#" color="success.main" sx={{ textDecoration: "underline", marginTop: "20px" }}>
          {t("Instructions for connecting to e-ID card")}
        </Link>
        <Hint sx={{ mt: "30px" }} type="hint">
          {t("ID-card is an internal passport (id card) of a citizen of the Kyrgyz Republic,")}
        </Hint>

        <Button type="submit" sx={{ padding: "10px 0", width: "100%", mt: "10px" }} fullWidth color="success">
          {t("Enter")}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginWithID;
