import React, { useRef, useState } from "react";

import { useTranslations } from "next-intl";
import { PermIdentity } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Divider, FormControl, InputLabel, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import Button from "../ui/Button";
import Input from "../ui/Input";
import ProfilePasswordForm from "./ProfilePasswordForm";

import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "@/validator-schemas/profile";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/profile/user";

import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

interface IProfileFormProps {}

interface IUserProfile {
  fullName: string;
  login: string;
  email: string;
  mobilePhone: string | undefined;
  // password: string;
  // cpassword: string;
  // oldpassword: string;
}

async function blobToFile(blob: Blob, fileName: string): Promise<File> {
  return new File([blob], fileName, { type: blob?.type });
}

const ProfileForm: React.FC<IProfileFormProps> = (props) => {
  const profile = useProfileStore((state) => state);
  const userData: IUserData | null = profile.getUserData();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, loading, update } = useFetch<Response>("", "POST", {
    useEffectOnce: false,
    returnResponse: true,
  });

  const {
    data: imageData,
    loading: isLoading,
    update: getImage,
  } = useFetch<Response>("/api/profile/download-image/" + userData?.id, "GET", {
    returnResponse: true,
  });

  useEffectOnce(async () => {
    const image: any = await imageData?.blob();

    const convertedFile = await blobToFile(image, "avatar-image.png");
    const url = URL.createObjectURL(convertedFile);
    setImagePreview(url);
    setSelectedImage(convertedFile);
  }, [imageData]);

  const form = useForm<IUserProfile>({
    resolver: yupResolver(userProfileSchema),
    defaultValues: {
      fullName: userData?.name,
      login: userData?.code,
      email: userData?.email,
      mobilePhone: userData?.["partner.mobilePhone"],
      // password: "",
      // cpassword: "",
      // oldpassword: "",
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
    if (userData?.id != null) {
      await update("/api/profile/update/" + userData?.id, {
        id: userData?.id,
        version: userData?.version,
        email: data.email,
        name: data.fullName,
        partner: {
          id: userData?.partner.id,
          version: userData?.partner.$version,
          mobilePhone: data.mobilePhone,
        },
      }).then((res) => {
        if (res.ok) {
          profile.loadUserData({
            username: userData.code,
          });
          getImage();
        }
      });
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

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
            {isLoading ? (
              <CircularProgress color="inherit" style={{ width: "28px", height: "28px" }} />
            ) : (
              <PermIdentity
                sx={{
                  width: "50px",
                  height: "50px",
                }}
              />
            )}
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
                fullWidth
                error={!!errors.fullName?.message ?? false}
                helperText={errors.fullName?.message}
                register={form.register}
                name="fullName"
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
                fullWidth
                error={!!errors.login?.message ?? false}
                helperText={errors.login?.message}
                register={form.register}
                name="login"
                disabled
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
                fullWidth
                error={!!errors.mobilePhone?.message ?? false}
                helperText={errors.mobilePhone?.message}
                register={form.register}
                name="mobilePhone"
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
        <Divider
          sx={{
            borderColor: "#CDCDCD",
          }}
        />
      </Box>
      <ProfilePasswordForm />
    </Box>
  );
};

export default ProfileForm;
