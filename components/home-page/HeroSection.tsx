import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login as loginSchema } from "@/validator-schemas/login";
import Link from "@/components/ui/Link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { IUserCredentials } from "@/models/profile/user";

const HeroSection: React.FC = () => {
  const t = useTranslations();

  const form = useForm<IUserCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = (data: IUserCredentials) => console.log(data);

  return (
    <Box component="section" padding="80px 0 40px 0" display="flex" justifyContent="space-between">
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
            />
          </Box>

          <Box
            display="flex"
            gap="10px"
            justifyContent="space-between"
            alignItems="center"
            sx={{ flexDirection: { xs: "column", md: "row" } }}
            marginTop="40px"
          >
            <Button type="submit" sx={{ padding: "10px 0", width: { xs: "100%", md: 250 } }} fullWidth color="success">
              {t("Enter")}
            </Button>

            <Link href={"/"} color="text.primary" sx={{ textDecoration: "underline" }} fontWeight={600}>
              {t("Other ways to log in")}
            </Link>
          </Box>

          <Link
            href={"/"}
            color="text.primary"
            marginTop={{ xs: "10px", md: "20px" }}
            sx={{ textDecoration: "underline", textAlign: { xs: "center", md: "start" }, display: "block" }}
          >
            {t("Forgot your password?")}
          </Link>
        </Box>
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Image src="/images/e-notariat.png" alt="E-notariat" width={602} height={554} layout="responsive" />
      </Box>
    </Box>
  );
};

export default HeroSection;
