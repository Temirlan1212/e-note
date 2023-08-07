import { Avatar, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { format } from "date-fns";

import Button from "../ui/Button";
import Rating from "../ui/Rating";
import { ApiNotaryResponse } from "@/models/notaries/notary";

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

interface INotariesInfoContentProps {}

const formatDate = (inputDate: string | number | Date) => {
  if (inputDate) {
    const date = new Date(inputDate);
    return format(date, "dd.MM.yyyy");
  }
};

const NotariesInfoContent = (props: INotariesInfoContentProps) => {
  const t = useTranslations();

  const router = useRouter();

  const { data, loading } = useFetch<ApiNotaryResponse>("/api/notaries/" + router.query.id, "POST");

  const notaryData = data?.data || [];

  const infoArray = [
    {
      text: notaryData[0]?.typeOfNotary,
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
      text: "+996 700 000 000, 555 000 000",
      icon: <PhoneEnabledOutlinedIcon />,
      type: "text",
      array: [],
    },
    {
      text: "+996 700 000 000",
      icon: <WhatsAppIcon />,
      type: "link",
      array: [],
    },
    {
      text: "balancha@gmail.com",
      icon: <EmailOutlinedIcon />,
      type: "link",
      array: [],
    },
    {
      text:
        notaryData[0]?.address.region.name +
        ", " +
        notaryData[0]?.address.district.name +
        ", " +
        notaryData[0]?.address.city.fullName,
      icon: <LocationOnOutlinedIcon />,
      type: "text",
      array: [],
    },
    {
      text: "Рабочие дни, с перерывом на обед",
      icon: <AccessTimeOutlinedIcon />,
      type: "list",
      array: notaryData[0]?.workingDay,
    },
  ];

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
            {notaryData[0]?.name}
          </Typography>
          <Box>
            <Box display="flex" gap="20px" flexDirection="column">
              {infoArray.map(({ text, icon: Icon, type, array }) => {
                return (
                  <Box display="flex" gap="15px" key={text}>
                    {Icon}
                    {type === "link" ? (
                      <a
                        href="#"
                        style={{
                          color: "#1BAA75",
                        }}
                      >
                        {text}
                      </a>
                    ) : (
                      type === "text" && <Typography>{text}</Typography>
                    )}
                    {type === "list" && (
                      <Box display="flex" flexDirection="column" gap="5px">
                        <Typography>{text}</Typography>
                        {array?.map((el, idx) => {
                          return (
                            <Box key={idx}>
                              <Typography>{el}</Typography>
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
        }}
      >
        <Button
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
        >
          {t("Write a message")}
        </Button>
      </Box>
    </Box>
  );
};

export default NotariesInfoContent;
