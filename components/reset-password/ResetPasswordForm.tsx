import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import Hint from "../ui/Hint";
import Input from "../ui/Input";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailSchema, IEmailSchema } from "@/validator-schemas/email";

const ResetPasswordForm = () => {
  const t = useTranslations();

  const form = useForm<IEmailSchema>({
    resolver: yupResolver(emailSchema),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = (data: { email: string }) => {
    console.log(data.email);
  };

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
        <Hint type="hint">{t("To change your password, enter your E-mail, A reset link will be sent to it,")}</Hint>
        <Input
          label="E-mail"
          variant="outlined"
          color="success"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          name="email"
          error={!!errors.email?.message ?? false}
          helperText={errors.email?.message && t(errors.email?.message)}
          register={form.register}
        />
        <Button type="submit" sx={{ padding: "10px 0", width: "100%" }} fullWidth color="success">
          {t("Send")}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
