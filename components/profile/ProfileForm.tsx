import React, { useRef, useState } from "react";

import { useTranslations } from "next-intl";
import { PermIdentity, Visibility, VisibilityOff } from "@mui/icons-material";
import { Avatar, Box, Divider, FormControl, IconButton, InputAdornment, InputLabel, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import Button from "../ui/Button";
import Input from "../ui/Input";

import { IUserProfile } from "@/models/user/profile";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "@/validator-schemas/profile";
import { useProfileStore } from "@/stores/profile";

interface IProfileFormProps {}

const ProfileForm: React.FC<IProfileFormProps> = (props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFirstPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const profile = useProfileStore((state) => state);

  const login = profile.getUser();

  const userData = profile.getUserData();

  console.log(profile);

  const form = useForm<IUserProfile>({
    resolver: yupResolver(userProfileSchema),
    defaultValues: {
      username: userData?.name,
      login: login?.username,
      email: userData?.email,
      telephoneNumber: userData?.["partner.mobilePhone"] || "996",
      password: "",
      cpassword: "",
    },
  });

  const t = useTranslations();

  const {
    formState: { errors },
    setError,
    reset,
  } = form;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: IUserProfile) => {
    console.log(data, selectedImage);
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleDeleteClick = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Box
        display="flex"
        gap="30px"
        sx={{
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        {imagePreview ? (
          <Avatar
            sizes="100"
            src={imagePreview}
            sx={{
              width: "100px",
              height: "100px",
            }}
            aria-label="recipe"
          />
        ) : (
          <Avatar
            sizes="100"
            sx={{
              bgcolor: "success.main",
              width: "100px",
              height: "100px",
            }}
            aria-label="recipe"
          >
            <PermIdentity
              sx={{
                width: "50px",
                height: "50px",
              }}
            />
          </Avatar>
        )}
        <Box display="flex" gap="20px" alignItems="center">
          <input ref={inputRef} accept="image/*" type="file" onChange={handleImageChange} style={{ display: "none" }} />
          <Button color="success" sx={{ width: "150px", boxShadow: "0" }} onClick={handleButtonClick}>
            {t("Upload")}
          </Button>
          <Button
            variant="outlined"
            sx={{
              width: "150px",
              border: "1px dashed  #CDCDCD",
              ":hover": {
                backgroundColor: "#fff",
                border: "1px dashed  #CDCDCD",
              },
            }}
            onClick={handleDeleteClick}
          >
            {t("Remove")}
          </Button>
        </Box>
      </Box>
      <Divider
        sx={{
          borderColor: "#CDCDCD",
        }}
      />
      <Box component="form" display="flex" flexDirection="column" gap="30px" onSubmit={form.handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              color: "#687C9B",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {t("Personal data")}
          </Typography>
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
                {t("Fullname")}
              </InputLabel>
              <Input
                // placeholder={t("Enter INN")}
                fullWidth
                error={!!errors.username?.message ?? false}
                helperText={errors.username?.message}
                register={form.register}
                name="username"
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
                {t("Username")}
              </InputLabel>
              <Input
                //   placeholder={t("Enter INN")}
                fullWidth
                error={!!errors.login?.message ?? false}
                helperText={errors.login?.message}
                register={form.register}
                name="login"
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              color: "#687C9B",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {t("Contact details")}
          </Typography>
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
                E-mail
              </InputLabel>
              <Input
                //   placeholder={t("Enter INN")}
                fullWidth
                error={!!errors.email?.message ?? false}
                helperText={errors.email?.message}
                register={form.register}
                name="email"
                type="email"
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
                {t("Phone number")}
              </InputLabel>
              <Input
                //   placeholder={t("Enter INN")}
                fullWidth
                error={!!errors.telephoneNumber?.message ?? false}
                helperText={errors.telephoneNumber?.message}
                register={form.register}
                name="telephoneNumber"
              />
            </FormControl>
          </Box>
        </Box>
        <Divider
          sx={{
            borderColor: "#CDCDCD",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              color: "#687C9B",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {t("Password")}
          </Typography>
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
                //   placeholder={t("Enter INN")}
                fullWidth
                error={!!errors.password?.message ?? false}
                helperText={errors.password?.message}
                register={form.register}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                        {showFirstPassword ? <VisibilityOff color="success" /> : <Visibility color="success" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showFirstPassword ? "text" : "password"}
                name="password"
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
                //   placeholder={t("Enter INN")}
                fullWidth
                error={!!errors.cpassword?.message ?? false}
                helperText={errors.cpassword?.message}
                register={form.register}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showSecondPassword ? <VisibilityOff color="success" /> : <Visibility color="success" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showSecondPassword ? "text" : "password"}
                name="cpassword"
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
            Сохранить
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
            type="submit"
          >
            Отмена
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileForm;
