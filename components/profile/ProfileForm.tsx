import React, { useRef, useState } from "react";

import { useTranslations } from "next-intl";
import { PermIdentity } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Divider, FormControl, InputLabel, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProfilePasswordForm from "./ProfilePasswordForm";

import { yupResolver } from "@hookform/resolvers/yup";
import { IUserProfileSchema, userProfileSchema } from "@/validator-schemas/profile";
import { IProfileState, useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/user";

import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Controller } from "react-hook-form";
import dynamic from "next/dynamic";

const UserTelInput = dynamic(() => import("@/components/ui/TelInput"), {
  ssr: false,
});

interface IProfileFormProps {}

interface IExtendedUserData extends IUserData {
  "partner.mobilePhone"?: string;
}

async function blobToFile(blob: Blob, fileName: string): Promise<File> {
  return new File([blob], fileName, { type: blob?.type });
}

const ProfileForm: React.FC<IProfileFormProps> = (props) => {
  const profile = useProfileStore<IProfileState>((state) => state);
  const userData: IExtendedUserData | null = profile.getUserData();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { loading: isDataLoading, update } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const {
    data: imageData,
    loading: isImageLoading,
    update: getImage,
  } = useFetch<Response>(userData?.id != null ? "/api/profile/download-image/" + userData?.id : "", "GET", {
    returnResponse: true,
  });

  const {
    data: userEmailData,
    update: getUserEmailData,
    loading: userEmailLoading,
  } = useFetch<FetchResponseBody>("", "POST");

  useEffectOnce(async () => {
    const image: any = await imageData?.blob();

    const convertedFile = await blobToFile(image, "avatar-image.png");
    const url = URL.createObjectURL(convertedFile);

    setImagePreview(url);
    setSelectedImage(convertedFile);
  }, [imageData]);

  const form = useForm<IUserProfileSchema>({
    resolver: yupResolver(userProfileSchema),
    defaultValues: {
      fullName: userData?.name,
      login: userData?.code,
      email: userData?.email,
      partner: {
        mobilePhone: userData?.["partner.mobilePhone"],
      },
    },
  });

  useEffectOnce(async () => {
    await getUserEmailData(userData?.partner?.id != null ? `/api/profile/partner/${userData.partner.id}` : "", {
      fields: ["emailAddress"],
    });
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

  const onSubmit = async (data: IUserProfileSchema) => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (userData?.id != null && reader.result) {
          await update("/api/profile/update/" + userData?.id, {
            id: userData?.id,
            version: userData?.version,
            name: data.fullName,
            image: reader.result.toString(),
            partner: {
              id: userData?.partner?.id,
              version: userData?.partner?.$version,
              mobilePhone: data?.partner?.mobilePhone,
              emailAddress: {
                id: userEmailData?.data?.[0]?.emailAddress?.id,
                version: userEmailData?.data?.[0]?.emailAddress?.$version,
                address: data.email,
              },
            },
          }).then((res) => {
            if (res && res.ok) {
              profile.loadUserData({
                username: userData.code,
              });
              getImage();
            }
          });
        }
      };
      reader.readAsDataURL(selectedImage);
    }
    if (!imagePreview) {
      if (userData?.id != null) {
        await update("/api/profile/update/" + userData?.id, {
          id: userData?.id,
          version: userData?.version,
          name: data.fullName,
          image: null,
          partner: {
            id: userData?.partner?.id,
            version: userData?.partner?.$version,
            mobilePhone: data?.partner?.mobilePhone,
            emailAddress: {
              id: userEmailData?.data?.[0]?.emailAddress?.id,
              version: userEmailData?.data?.[0]?.emailAddress?.$version,
              address: data.email,
            },
          },
        }).then((res) => {
          if (res && res.ok) {
            profile.loadUserData({
              username: userData.code,
            });
            getImage();
          }
        });
      }
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
            {isImageLoading ? (
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
                background: "#fff !important",
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
                helperText={errors.fullName?.message ? t(errors.fullName?.message) : ""}
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
              <Input fullWidth register={form.register} name="login" disabled />
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
                disabled={userEmailLoading}
                fullWidth
                error={!!errors.email?.message ?? false}
                helperText={errors.email?.message ? t(errors.email?.message) : ""}
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
              <Controller
                name="partner.mobilePhone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <UserTelInput
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    {...field}
                  />
                )}
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
            loading={isDataLoading}
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
            loading={isDataLoading}
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
