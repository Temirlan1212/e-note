import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "@/components/ui/Link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const LoginWithINN = () => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box component="form" onSubmit={(e) => e.preventDefault()}>
      <Box display="flex" flexDirection="column" gap="20px">
        <Input
          label={t("Personal number (TIN)")}
          variant="outlined"
          color="success"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          name="INN"
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
  );
};

export default LoginWithINN;
