import React, { useEffect, useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { PermIdentity } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Divider, FormControl, InputLabel, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProfilePasswordForm from "./ProfilePasswordForm";

import { yupResolver } from "@hookform/resolvers/yup";
import { IUserProfileSchema, userProfileSchema } from "@/validator-schemas/profile";
import { IProfileState, useProfileStore } from "@/stores/profile";
import { IEmail, IUserData } from "@/models/user";

import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import Address from "@/components/fields/Address";
import License from "@/components/fields/License";
import Hint from "@/components/ui/Hint";
import Contact from "@/components/fields/Contact";
import Coordinates from "@/components/fields/Coordinates";
import ExpandingFields from "../fields/ExpandingFields";

interface IProfileFormProps {}

interface IExtendedUserData extends IUserData {
  "partner.mobilePhone"?: string;
  "partner.emailAddress"?: IEmail;
}

async function blobToFile(blob: Blob, fileName: string): Promise<File> {
  return new File([blob], fileName, { type: blob?.type });
}

const ProfileForm: React.FC<IProfileFormProps> = (props) => {
  const t = useTranslations();

  const inputRef = useRef<HTMLInputElement>(null);

  const profile = useProfileStore<IProfileState>((state) => state);
  const profileData: IExtendedUserData | null = profile.getUserData();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<FetchResponseBody | null>();

  const { loading: isDataLoading, update } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const { update: getUserData, loading: userDataLoading } = useFetch("", "POST");

  useEffectOnce(async () => {
    const res = await getUserData(profileData?.id != null ? "/api/profile/user/" + profileData?.id : "", {
      userRole: profileData?.activeCompany ? "notary" : "declarant",
    });
    if (Array.isArray(res?.data) && res?.data.length > 0) {
      setUserData(res);
    }
  });

  const {
    data: imageData,
    loading: isImageLoading,
    update: getImage,
  } = useFetch<Response>(profileData?.id != null ? "/api/profile/download-image/" + profileData?.id : "", "GET", {
    returnResponse: true,
  });

  useEffectOnce(async () => {
    const image: any = await imageData?.blob();

    const convertedFile = await blobToFile(image, "avatar-image.png");
    const url = URL.createObjectURL(convertedFile);

    setImagePreview(url);
    setSelectedImage(convertedFile);
  }, [imageData]);

  const form = useForm<IUserProfileSchema>({
    resolver: yupResolver(userProfileSchema),
    values: userData?.data?.[0] != null ? userData?.data?.[0] : null,
  });

  const {
    formState: { errors },
    setError,
    reset,
    control,
    trigger,
    watch,
    resetField,
    getValues,
  } = form;

  const addressNames = {
    region: "activeCompany.address.region",
    district: "activeCompany.address.district",
    city: "activeCompany.address.city",
    street: "activeCompany.address.addressL4",
    house: "activeCompany.address.addressL3",
    apartment: "activeCompany.address.addressL2",
    notaryDistrict: "activeCompany.notaryDistrict",
  };

  const licenseNames = {
    licenseNo: "activeCompany.licenseNo",
    licenseStatus: "activeCompany.licenseStatus",
    licenseTermFrom: "activeCompany.licenseTermFrom",
    licenseTermUntil: "activeCompany.licenseTermUntil",
  };

  const coordinateNames = {
    latitude: "activeCompany.latitude",
    longitude: "activeCompany.longitude",
  };

  const contactNames = {
    phone: "partner.mobilePhone",
    email: "partner.emailAddress.address",
  };

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
        if (profileData?.id != null && reader.result) {
          const params = {
            userData: userData,
            submitData: data,
            image: reader.result.toString(),
          };
          await update("/api/profile/update/" + profileData?.id, {
            body: params,
          }).then((res) => {
            if (res && res.ok) {
              profile.loadUserData({
                username: userData?.data?.[0]?.code,
              });
              getImage();
            }
          });
        }
      };
      reader.readAsDataURL(selectedImage);
    }
    if (!imagePreview) {
      if (profileData?.id != null) {
        const params = {
          userData: userData,
          submitData: data,
          image: null,
        };
        await update("/api/profile/update/" + profileData?.id, {
          body: params,
        }).then((res) => {
          if (res && res.ok) {
            profile.loadUserData({
              username: userData?.data?.[0]?.code,
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

  const resetFields = () => {
    const allFields = {
      ...addressNames,
      ...coordinateNames,
      ...licenseNames,
      ...contactNames,
    };

    for (const key in allFields) {
      const name = (allFields as Record<string, any>)?.[key];
      const value = getValues(name as any);
      const isBoolean = typeof value === "boolean";
      const isString = typeof value === "string";

      if (isBoolean) {
        resetField(name as any, { defaultValue: false });
      } else if (isString) {
        resetField(name as any, { defaultValue: "" });
      }
    }
  };

  return userDataLoading ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  ) : (
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
            flexWrap="wrap"
            gap="20px"
            sx={{
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
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
                {t("Last name")}
              </InputLabel>
              <Input
                fullWidth
                error={!!errors.partner?.lastName?.message ?? false}
                helperText={errors.partner?.lastName?.message ? t(errors.partner?.lastName?.message) : ""}
                register={form.register}
                name="partner.lastName"
              />
            </FormControl>
            <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
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
                {t("First name")}
              </InputLabel>
              <Input
                fullWidth
                error={!!errors.partner?.firstName?.message ?? false}
                helperText={errors.partner?.firstName?.message ? t(errors.partner?.firstName?.message) : ""}
                register={form.register}
                name="partner.firstName"
              />
            </FormControl>
            <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
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
                {t("Middle name")}
              </InputLabel>
              <Input
                fullWidth
                error={!!errors.partner?.middleName?.message ?? false}
                helperText={errors.partner?.middleName?.message ? t(errors.partner?.middleName?.message) : ""}
                register={form.register}
                name="partner.middleName"
              />
            </FormControl>
            <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
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
              <Input fullWidth register={form.register} name="code" disabled />
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
            <Contact form={form} names={contactNames} boxSx={{ width: "100%" }} />
          </Box>
        </Box>

        <ExpandingFields title="Additional information" permanentExpand={true}>
          <Box display="flex" flexDirection="column" gap="30px">
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
                {t("Address")}
              </Typography>
              <Box
                display="flex"
                gap="20px"
                sx={{
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  justifyContent: "space-between",
                }}
              >
                <Address form={form} names={addressNames} withNotaryDistrict={true} boxSx={{ width: "100%" }} />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    color: "#687C9B",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {t("Coordinates on the map")}
                </Typography>
                <Hint type="hint" defaultActive={false}>
                  {t("Specify coordinates to display them on the map")}
                </Hint>
              </Box>
              <Box
                display="flex"
                gap="20px"
                sx={{
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  justifyContent: "space-between",
                }}
              >
                <Coordinates form={form} names={coordinateNames} maxLength={9} boxSx={{ width: "100%" }} />
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
                {t("License information")}
              </Typography>
              <Box
                display="flex"
                flexWrap="wrap"
                gap="20px"
                sx={{
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <License form={form} names={licenseNames} disableFields={true} />
              </Box>
            </Box>
          </Box>
        </ExpandingFields>

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
            onClick={resetFields}
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
