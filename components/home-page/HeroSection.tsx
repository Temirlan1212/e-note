import { Box, Button, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login as loginSchema } from "@/validator-schemas/login";
import Link from "@/components/ui/Link";
import Input from "@/components/ui/Input";

interface IFormValues {
  username: string;
  password: string;
}

const HeroSection: React.FC = () => {
  const t = useTranslations();

  const form = useForm<IFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = (data: IFormValues) => console.log(data);

  return (
    <Box component="section" padding="80px 0 40px 0" display="flex" justifyContent="space-between">
      <Box>
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

          <Box>
            <Button type="submit" sx={{ padding: "10px 0", width: 250 }} fullWidth color="success">
              {t("Enter")}
            </Button>

            <Button type="submit" sx={{ padding: "10px 0", width: 250, background: "transparent" }} fullWidth>
              <Link href={"/"} color="text.primary" sx={{ textDecoration: "underline" }} fontWeight={600}>
                {t("Other ways to log in")}
              </Link>
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Image src="/images/e-notariat.png" alt="E-notariat" width={602} height={554} layout="responsive" />
      </Box>
    </Box>
  );
};

export default HeroSection;
