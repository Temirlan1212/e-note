import { Avatar, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { format } from "date-fns";

import Button from "../ui/Button";
import Rating from "../ui/Rating";
import { ApiNotaryResponse } from "@/models/notaries";
import Link from "@/components/ui/Link";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import profileImage from "@/public/images/avatar.png";
import LicenseIcon from "@/public/icons/license.svg";
import ContentPlusIcon from "@/public/icons/content-plus.svg";
import CloudMessageIcon from "@/public/icons/cloud-message.svg";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/profile";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IUserData } from "@/models/user";
import { IContact } from "@/models/chat";
import useNotariesStore from "@/stores/notaries";

interface INotariesInfoContentProps {}

enum TypeOfNotary {
  State = "state",
  Private = "private",
}

const formatDate = (inputDate: string | number | Date) => {
  if (inputDate) {
    const date = new Date(inputDate);
    return format(date, "dd.MM.yyyy");
  }
};

const NotariesInfoContent = (props: INotariesInfoContentProps) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const t = useTranslations();
  const router = useRouter();
  const { locale } = useRouter();

  const profile = useProfileStore((state) => state);
  const setNotaryData = useNotariesStore((state) => state.setNotaryData);
  const { data, loading } = useFetch<ApiNotaryResponse>("/api/notaries/" + router.query.id, "POST");

  const { data: workDaysArea } = useFetch("/api/notaries/dictionaries/work-days", "GET");

  const { update: contactUpdate } = useFetch<IContact>("", "POST");

  const notaryData = data?.data || [];

  const workDaysAreaData = workDaysArea?.data || [];

  const normalizePhoneNumber = (phoneNumber: string) => phoneNumber?.replace(/\D/g, "");

  const handleOpenChat = async () => {
    const res = await contactUpdate("/api/chat/create/user/" + router.query.id);
    if (res?.data?.chatRoomLink) {
      const href = `${res.data.chatRoomLink}?AuthorizationBasic=${res.data.userToken.replace(/Basic /, "")}` as string;
      window.open(href, "_blank");
    }
  };

  const infoArray = [
    {
      text:
        notaryData[0]?.typeOfNotary === TypeOfNotary.State
          ? t("State notary")
          : notaryData[0]?.typeOfNotary === TypeOfNotary.Private
          ? t("Private notary")
          : "",
      icon: <AccountCircleOutlinedIcon />,
      type: "text",
      array: [],
    },
    {
      text: notaryData[0]?.licenseNo + " от " + formatDate(notaryData[0]?.licenseTermFrom),
      icon: <LicenseIcon />,
      type: "text",
      array: [],
    },
    {
      text: notaryData[0]?.partner?.mobilePhone,
      icon: <PhoneEnabledOutlinedIcon />,
      type: "link",
      href: `tel:+${normalizePhoneNumber(notaryData[0]?.partner?.mobilePhone)}`,
      array: [],
    },
    {
      text: notaryData[0]?.partner?.mobilePhone,
      icon: <WhatsAppIcon />,
      type: "link",
      href: `https://wa.me/${normalizePhoneNumber(notaryData[0]?.partner?.mobilePhone)}`,
      array: [],
    },
    {
      text: notaryData[0]?.partner?.email,
      icon: <EmailOutlinedIcon />,
      type: "link",
      href: `mailto:${notaryData[0]?.partner?.email}`,
      array: [],
    },
    {
      text: `${notaryData[0]?.notaryDistrict[locale === "ru" || locale === "kg" ? "$t:name" : "name"]}, ${notaryData[0]
        ?.address.fullName}`,
      icon: <LocationOnOutlinedIcon />,
      type: "text",
      array: [],
    },
    {
      text: t("Working days, with a lunch break"),
      icon: <AccessTimeOutlinedIcon />,
      type: "list",
      array: notaryData[0]?.workingDay,
    },
  ];

  useEffectOnce(async () => {
    setUserData(profile.getUserData());
  }, [profile]);

  const handleCreateAppClick = () => {
    notaryData?.[0] != null && setNotaryData(notaryData[0]);
    router.push("/applications/create");
  };

  const filteredInfoArray = infoArray.filter((item) => item.text);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: {
          xs: "center",
          md: "space-between",
        },
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: {
            xs: "25px",
            md: "30px",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: {
              xs: "center",
              md: "start",
            },
          }}
        >
          {notaryData[0]?.logo ? (
            <Box
              sx={{
                width: "194px",
                height: "194px",
                objectFit: "contain",
              }}
            >
              <Image src={notaryData[0]?.logo} alt="notaryImage" />
            </Box>
          ) : (
            <Avatar
              sizes="194"
              sx={{
                bgcolor: "success.main",
                width: "194px",
                height: "194px",
                borderRadius: 0,
              }}
              aria-label="recipe"
            />
          )}

          <Box>
            <Box display="flex" gap="8px">
              <Rating value={4} readOnly />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                4,0
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "#BDBDBD",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              45 оцен.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "0 30px",
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {notaryData[0]?.partner?.fullName}
          </Typography>
          <Box>
            <Box display="flex" gap="20px" flexDirection="column">
              {filteredInfoArray.map(({ text, icon: Icon, type, array, href }) => {
                return (
                  <Box display="flex" gap="15px" key={text}>
                    {Icon}
                    {type === "link" ? (
                      <Link
                        rel="noopener noreferrer"
                        target="_blank"
                        href={href ?? "#"}
                        style={{
                          color: "#1BAA75",
                        }}
                      >
                        {text}
                      </Link>
                    ) : (
                      type === "text" && <Typography>{text}</Typography>
                    )}
                    {type === "list" && (
                      <Box display="flex" flexDirection="column" gap="5px">
                        <Typography>{text}</Typography>
                        {array?.map((el, idx) => {
                          const matchingTitle = workDaysAreaData.find(
                            (item: any) => item?.order_seq === el?.weekDayNumber - 1
                          );
                          const translatedTitle = matchingTitle?.["title_" + locale];
                          const title = Boolean(translatedTitle) ? translatedTitle : matchingTitle?.title ?? "";

                          const startDate = el?.startDate ? el.startDate.slice(0, 5) : "";
                          const endDate = el?.endDate ? el.endDate.slice(0, 5) : "";
                          const timeRange = startDate && endDate ? `${startDate} - ${endDate}` : "";
                          return (
                            <Box key={idx}>
                              <Typography>
                                {title} {timeRange}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          marginTop: { xs: "30px", sm: "30px", md: "unset", lg: "unset" },
        }}
      >
        <Button
          onClick={handleCreateAppClick}
          startIcon={<ContentPlusIcon />}
          color="success"
          sx={{
            width: {
              sx: "100%",
              md: "320px",
            },
            padding: "10px 0",
          }}
        >
          {t("Create application")}
        </Button>

        {userData?.group?.id === 4 ? null : (
          <Button
            startIcon={<CloudMessageIcon />}
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
            onClick={handleOpenChat}
          >
            {t("Write a message")}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NotariesInfoContent;
