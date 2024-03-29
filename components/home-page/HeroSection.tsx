import { Box, FormHelperText, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { login as loginSchema } from "@/validator-schemas/login";
import Link from "@/components/ui/Link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { IUser, IUserCredentials } from "@/models/user";
import { useProfileStore } from "@/stores/profile";
import { useEffect, useState } from "react";
import ReCAPTCHA from "@/components/recaptcha/Recaptcha";

const HeroSection: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaSuccess, setRecaptchaSuccess] = useState(false);

  const handleRecaptchaSuccess = (success: boolean) => {
    setRecaptchaSuccess(success);
  };

  const form = useForm<IUserCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const {
    formState: { errors },
    setError,
  } = form;

  const onSubmit = async (data: IUserCredentials) => {
    if (!recaptchaSuccess) {
      setError("root.serverError", { type: "custom", message: "Please confirm that you are not a robot" });
      return;
    }

    setLoading(true);
    await profile.logIn(data);
    const user = profile.getUser();
    setLoading(false);
    setUser(user);

    if (user == null) {
      setError("root.serverError", { type: "custom", message: "Incorrect password or username" });
    } else {
      form.reset();
    }
  };

  useEffect(() => {
    setUser(profile.user);
  }, [profile.user]);

  return (
    <Box component="section" display="flex" justifyContent="space-between" alignItems={"center"}>
      <Box margin={{ xs: "auto", md: "0" }}>
        <Typography variant="h2" fontWeight={600} sx={{ maxWidth: { xs: 400, md: 510 }, marginBottom: "40px" }}>
          {t("Welcome to a single platform")}{" "}
          <Typography
            variant="h2"
            component="span"
            sx={{ display: { xs: "inline", md: "block" } }}
            fontWeight={600}
            color="success.main"
          >
            {t("Electronic Notary of the KR")}
          </Typography>
        </Typography>

        {user == null ? (
          <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap="20px">
              <Typography variant="h6" component="span" fontWeight={600} color="text.primary">
                {t("Login to your personal account")}
              </Typography>

              <Input
                label={t("Username")}
                variant="outlined"
                color="success"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.username?.message ?? false}
                helperText={errors.username?.message && t(errors.username?.message)}
                register={form.register}
                name="username"
              />

              <Input
                label={t("Password")}
                variant="outlined"
                color="success"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.password?.message ?? false}
                helperText={errors.password?.message && t(errors.password?.message)}
                register={form.register}
                name="password"
                type="password"
              />

              <ReCAPTCHA onRecaptchaSuccess={handleRecaptchaSuccess} />
            </Box>
            <FormHelperText sx={{ color: "red" }}>
              {errors.root?.serverError?.message && t(errors.root?.serverError?.message)}
            </FormHelperText>

            <Box
              display="flex"
              gap="10px"
              justifyContent="space-between"
              alignItems="center"
              sx={{ flexDirection: { xs: "column", md: "row" } }}
              marginTop="40px"
            >
              <Button
                type="submit"
                sx={{
                  padding: "10px 0",
                  width: { xs: "100%", md: 250 },
                  display: "flex",
                  gap: "30px",
                }}
                fullWidth
                color="success"
                loading={loading}
              >
                {t("Enter")}
              </Button>

              <Link
                href="login"
                color="text.primary"
                sx={{
                  textDecoration: "underline",
                  textAlign: "center",
                  width: { xs: "100%", md: 250 },
                }}
                fontWeight={600}
              >
                {t("Other ways to log in")}
              </Link>
            </Box>

            <Link
              href={"/reset-password"}
              color="text.primary"
              marginTop={{ xs: "10px", md: "20px" }}
              sx={{ textDecoration: "underline", textAlign: { xs: "center", md: "start" }, display: "block" }}
            >
              {t("Forgot your password?")}
            </Link>
          </Box>
        ) : (
          <Box onClick={() => router.push("/profile")} display="flex" flexDirection="column" gap="20px">
            <Button
              sx={{
                padding: "15px 0",
                width: { xs: "100%", md: 400 },
                display: "flex",
                gap: "30px",
              }}
              fullWidth
              color="success"
            >
              {t("Go to your personal account")}
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Image src="/images/e-notariat.png" alt="E-notariat" width={602} height={554} layout="responsive" />
      </Box>
    </Box>
  );
};

export default HeroSection;
