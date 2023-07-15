import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const NewPasswordForm = () => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <>
      <Hint type="hint">
        {t(
          "Type a new password to enter your personal account, We advise you to adhere to the following rules when compiling a password: The password must contain at least 8 characters The presence of numbers and letters of the upper jean of lower registers The presence of special characters - «@», «$», «&» etc,"
        )}
      </Hint>
      <Input
        label={t("New Password")}
        variant="outlined"
        color="success"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        name="pa"
      />
      <Input
        type={showPassword ? "text" : "password"}
        label={t("Password confirmation")}
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
        name="email"
      />
      <Button type="submit" sx={{ padding: "10px 0", width: "100%" }} fullWidth color="success">
        {t("Send")}
      </Button>
    </>
  );
};

export default NewPasswordForm;
