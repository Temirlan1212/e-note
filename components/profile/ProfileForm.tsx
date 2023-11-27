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

const ProfileForm: React.FC<IProfileFormProps> = (props) => {
  const t = useTranslations();

  const inputRef = useRef<HTMLInputElement>(null);

  const profile = useProfileStore<IProfileState>((state) => state);
  const profileData: IExtendedUserData | null = profile.getUserData();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<FetchResponseBody | null>();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [userIsNotary, setUserIsNotary] = useState(false);

  const { loading: isDataLoading, update } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const { update: getUserData, loading: userDataLoading } = useFetch("", "POST");

  useEffectOnce(async () => {
    setUserIsNotary(Boolean(profileData?.activeCompany));

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
    const base64String = await imageData?.text();
    if (base64String) {
      setBase64Image(base64String);
    }
  }, [imageData]);

  const form = useForm<IUserProfileSchema>({
    resolver: yupResolver(userProfileSchema),
    values: userData?.data?.[0] != null ? userData?.data?.[0] : null,
  });

  const {
    formState: { errors },
    reset,
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
            userRole: profileData?.activeCompany ? "notary" : "declarant",
            userData: userData,
            submitData: data,
            imageBase64: reader.result.toString(),
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
          userRole: profileData?.activeCompany ? "notary" : "declarant",
          userData: userData,
          submitData: data,
          imageBase64: base64Image,
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
    setBase64Image(null);
    setImagePreview(null);
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
        {isImageLoading ? (
          <CircularProgress color="inherit" style={{ width: "28px", height: "28px" }} />
        ) : (
          <Avatar
            sizes="100"
            src={imagePreview || base64Image || undefined}
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

        {!userIsNotary ? undefined : (
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
                  <Address
                    form={form}
                    names={addressNames}
                    withNotaryDistrict={true}
                    getAllNotaryDistricts={true}
                    boxSx={{ width: "100%" }}
                  />
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
        )}

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
            onClick={() => reset()}
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
