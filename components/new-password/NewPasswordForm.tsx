import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { INewPasswordSchema, newPasswordSchema } from "@/validator-schemas/new-password";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/router";

const NewPasswordForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { data, loading, update } = useFetch("", "POST");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const form = useForm<INewPasswordSchema>({
    resolver: yupResolver(newPasswordSchema),
  });

  const token = router.asPath.match(/token=([^&]+)/);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  const onSubmit = (data: { password: string }) => {
    if (token) {
      update("/api/password/new-password", {
        token: token[1],
        password: data.password,
      });
    }
  };

  if (data?.status === 0) {
    router.push("/");
  }

  return (
    <Box py={5}>
      <Typography variant="h1" fontWeight={600} my={6} textAlign="center">
        {t("Reset Password")}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          padding: "30px 20px",
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 5px 20px 0px #E9E9E9",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
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
          name="password"
          error={!!errors.password?.message ?? false}
          helperText={errors.password?.message ? t(errors.password?.message, { min: 8 }) : ""}
          register={register}
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
          name="newPassword"
          error={!!errors.newPassword?.message ?? false}
          helperText={errors.newPassword?.message && t(errors.newPassword?.message)}
          register={register}
        />
        <Button loading={loading} type="submit" sx={{ padding: "10px 0", width: "100%" }} fullWidth color="success">
          {t("Send")}
        </Button>
      </Box>
    </Box>
  );
};

export default NewPasswordForm;
