import { useTranslations } from "next-intl";
import { Box, FormControl, InputLabel, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { IUserData } from "@/models/profile/user";
import { useProfileStore } from "@/stores/profile";
import useFetch from "@/hooks/useFetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfilePasswordSchema } from "@/validator-schemas/profile";
import { useState } from "react";

interface IProfilePasswordFormProps {}

interface IUserPasswords {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ProfilePasswordForm = (props: IProfilePasswordFormProps) => {
  const profile = useProfileStore((state) => state);
  const userData: IUserData | null = profile.getUserData();

  const t = useTranslations();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const { data, loading, update, error } = useFetch("", "POST");

  const form = useForm<IUserPasswords>({
    resolver: yupResolver(userProfilePasswordSchema),
  });

  const {
    formState: { errors },
    setError,
    reset,
  } = form;

  const onSubmit = async (data: IUserPasswords) => {
    await update("/api/profile/update/" + userData?.id, {
      id: userData?.id,
      version: userData?.version,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      chkPassword: data.confirmNewPassword,
    }).then((data) => {
      console.log(data);
    });
    reset();
  };

  return (
    <Box component="form" display="flex" flexDirection="column" gap="30px" onSubmit={form.handleSubmit(onSubmit)}>
      <Button
        onClick={toggleVisibility}
        buttonType="secondary"
        sx={{
          width: {
            sx: "100%",
            md: "320px",
          },
          padding: "10px 0",
          ":hover": {
            backgroundColor: "#3F5984",
          },
        }}
      >
        {t("Change password")}
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxHeight: isVisible ? "1000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        <Typography
          sx={{
            color: "#687C9B",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {t("Change password")}
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              color: "#24334B",
              fontSize: "18px",
              top: "10px",
              left: "-14px",
              fontWeight: "500",
              position: "inherit",
            }}
            shrink
          >
            {t("Old password")}
          </InputLabel>
          <Input
            fullWidth
            error={(!!errors.oldPassword?.message || data?.status === -1) ?? false}
            helperText={
              (errors.oldPassword?.message && t(errors.oldPassword?.message)) ||
              (data?.status === -1 && data.data.message && t(data.data.message))
            }
            register={form.register}
            name="oldPassword"
            type="password"
          />
        </FormControl>
        <Box
          display="flex"
          gap="20px"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              sx={{
                color: "#24334B",
                fontSize: "18px",
                top: "10px",
                left: "-14px",
                fontWeight: "500",
                position: "inherit",
              }}
              shrink
            >
              {t("Enter password")}
            </InputLabel>
            <Input
              fullWidth
              error={(!!errors.newPassword?.message || data?.status === -1) ?? false}
              helperText={errors.newPassword?.message ? t(errors.newPassword?.message) : ""}
              register={form.register}
              name="newPassword"
              type="password"
              key="password"
            />
          </FormControl>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              sx={{
                color: "#24334B",
                fontSize: "18px",
                top: "10px",
                left: "-14px",
                fontWeight: "500",
                position: "inherit",
              }}
              shrink
            >
              {t("Confirm password")}
            </InputLabel>
            <Input
              fullWidth
              error={(!!errors.confirmNewPassword?.message || data?.status === -1) ?? false}
              helperText={errors.confirmNewPassword?.message ? t(errors.confirmNewPassword?.message) : ""}
              register={form.register}
              name="confirmNewPassword"
              type="password"
              key="password"
            />
          </FormControl>
        </Box>
      </Box>
      <Box
        display="flex"
        gap="30px"
        sx={{
          flexDirection: {
            xs: "column",
            md: "row",
          },
          maxHeight: isVisible ? "1000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        <Button
          color="success"
          sx={{
            maxWidth: "320px",
          }}
          loading={loading}
          type="submit"
        >
          {t("Save")}
        </Button>
        <Button
          buttonType="secondary"
          sx={{
            maxWidth: "320px",
            ":hover": {
              background: "#3f5984",
            },
          }}
          loading={loading}
        >
          {t("Cancel")}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePasswordForm;
