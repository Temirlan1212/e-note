import { Box, FormHelperText, IconButton, InputAdornment } from "@mui/material";
import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Link from "../ui/Link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useProfileStore } from "@/stores/profile";
import { IUserCredentials } from "@/models/user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login as loginSchema } from "@/validator-schemas/login";

const LoginAndPasswordForm: React.FC = () => {
  const t = useTranslations();
  const profile = useProfileStore((state) => state);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<IUserCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const {
    formState: { errors },
    setError,
  } = form;

  const onSubmit = async (data: IUserCredentials) => {
    setLoading(true);
    await profile.logIn(data);
    const user = profile.getUser();
    setLoading(false);

    if (user == null) {
      setError("root.serverError", { type: "custom", message: "Incorrect password or username" });
      console.log(errors);
    } else {
      form.reset();
    }
  };

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

      <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
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
            error={!!errors.username?.message ?? false}
            helperText={errors.username?.message && t(errors.username?.message)}
            register={form.register}
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
            error={!!errors.password?.message ?? false}
            helperText={errors.password?.message && t(errors.password?.message)}
            register={form.register}
          />

          <FormHelperText sx={{ color: "red" }}>
            {errors.root?.serverError?.message && t(errors.root?.serverError?.message)}
          </FormHelperText>

          <Link sx={{ textDecoration: "underline" }} color="#24334B" href="/reset-password">
            {t("Forgot password")}
          </Link>

          <Button
            type="submit"
            sx={{ padding: "10px 0", width: "100%", mt: "10px" }}
            fullWidth
            color="success"
            loading={loading}
          >
            {t("Enter")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginAndPasswordForm;
