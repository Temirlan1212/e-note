import React, { useEffect, useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { PermIdentity } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProfilePasswordForm from "./ProfilePasswordForm";

import { yupResolver } from "@hookform/resolvers/yup";
import { IUserProfileSchema, userProfileSchema } from "@/validator-schemas/profile";
import { IProfileState, useProfileStore } from "@/stores/profile";
import useNotificationStore from "@/stores/notification";
import { IEmail, IUserData } from "@/models/user";

import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import useConvert from "@/hooks/useConvert";
import Address from "@/components/fields/Address";
import License from "@/components/fields/License";
import Hint from "@/components/ui/Hint";
import Contact from "@/components/fields/Contact";
import FullName from "@/components/fields/FullName";
import Coordinates from "@/components/fields/Coordinates";
import ExpandingFields from "../fields/ExpandingFields";
import ProfileWorkingDays from "./ProfileWorkingDays";
import { format } from "date-fns";

interface IProfileFormProps {}

interface IExtendedUserData extends IUserData {
  "partner.mobilePhone"?: string;
  "partner.emailAddress"?: IEmail;
}

const ProfileForm: React.FC<IProfileFormProps> = (props) => {
  const t = useTranslations();
  const locale = useLocale();
  const convert = useConvert();

  const inputRef = useRef<HTMLInputElement>(null);

  const profile = useProfileStore<IProfileState>((state) => state);
  const profileData: IExtendedUserData | null = profile.getUserData();
  const setNotification = useNotificationStore((state) => state.setNotification);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<FetchResponseBody | null>();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [userIsNotary, setUserIsNotary] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState<string | null | undefined>(null);

  const { loading: isDataLoading, update } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const { update: getUserData, loading: userDataLoading } = useFetch("", "POST");
  const { data: checkFaceData, update: checkFace, loading: checkFaceLoading } = useFetch("", "POST");

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
    control,
    trigger,
    getValues,
    setValue,
    resetField,
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

  const workModeNames = {
    roundClock: "activeCompany.roundClock",
    departure: "activeCompany.departure",
  };

  const personalDataNames = {
    firstName: "partner.firstName",
    lastName: "partner.lastName",
    middleName: "partner.middleName",
    code: "code",
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);

    if (file) {
      const blob = new Blob([file], { type: file.type });
      const res = await checkFace("/api/check-face", { image: await convert.blob.toBase64Async(blob) });

      if (res) {
        const isFaceDetected = res?.data?.message_en === "Face detected";

        setImagePreview(isFaceDetected ? URL.createObjectURL(file) : null);
        setAlertText(res?.status !== 0 ? t("Something went wrong") : res?.data?.["message_" + locale]);
        setAlertOpen(true);
      }
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
              setNotification(t("Profile saved successfully"), "success");
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
            setNotification(t("Profile saved successfully"), "success");
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
    setAlertOpen(false);
    setAlertText(null);
  };

  const formatLicenseDate = () => {
    const formValues = getValues("activeCompany");
    if (formValues) {
      const { licenseTermFrom, licenseTermUntil } = formValues;
      const formattedLicenseTermFrom = licenseTermFrom ? format(new Date(licenseTermFrom), "dd.MM.yyyy") : null;
      const formattedLicenseTermUntil = licenseTermUntil ? format(new Date(licenseTermUntil), "dd.MM.yyyy") : null;

      setValue("activeCompany.licenseTermFrom", formattedLicenseTermFrom);
      setValue("activeCompany.licenseTermUntil", formattedLicenseTermUntil);
    }
  };

  const handleFormReset = () => {
    reset();
    formatLicenseDate();
  };

  useEffectOnce(() => {
    formatLicenseDate();
  }, [userData]);

  return userDataLoading ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box display="flex" flexDirection="column" gap="30px">
      <Collapse in={alertOpen}>
        <Alert
          severity={checkFaceData?.data?.message_en === "Face detected" ? "success" : "warning"}
          onClose={() => setAlertOpen(false)}
        >
          {alertText}
        </Alert>
      </Collapse>
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
        {isImageLoading || checkFaceLoading ? (
          <CircularProgress color="inherit" style={{ width: "28px", height: "28px" }} />
        ) : (
          <Avatar
            sizes="100"
            src={imagePreview || base64Image || undefined}
            sx={{
              bgcolor: imagePreview || base64Image ? "transparent" : "success.main",
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
            <FullName
              form={form}
              names={personalDataNames}
              sx={{ boxSx: { width: "100%" }, labelsSx: { fontWeight: "600" } }}
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
            <Contact
              form={form}
              names={contactNames}
              sx={{ boxSx: { width: "100%" }, labelsSx: { fontWeight: "600" } }}
            />
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
                    sx={{ boxSx: { width: "100%" }, labelsSx: { fontWeight: "600" } }}
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
                  <Coordinates
                    form={form}
                    names={coordinateNames}
                    withMap={true}
                    sx={{ boxSx: { width: "100%" }, labelsSx: { fontWeight: "600" } }}
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
                  <License
                    form={form}
                    names={licenseNames}
                    disableFields={true}
                    sx={{ labelsSx: { fontWeight: "600" } }}
                  />
                </Box>
              </Box>

              <ProfileWorkingDays profileForm={form} names={userIsNotary ? workModeNames : undefined} />
            </Box>
          </ExpandingFields>
        )}

        <Box
          display="flex"
          gap="30px"
          sx={{
            position: "sticky",
            bottom: "20px",
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
            onClick={handleFormReset}
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
