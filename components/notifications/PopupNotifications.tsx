import React, { useEffect, useState } from "react";
import { Typography, Box, Popover, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { useTranslations } from "next-intl";

import Button from "../ui/Button";

export default function PopupNotifications() {
  const [notifications, setNotifications] = useState<{ time: string; text: string }[]>([]);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const t = useTranslations();

  const sampleData = [
    { time: new Date("20 Jule 2023 7:48 UTC").toISOString(), text: "Новое сообщение от пользователя Нурмырзаевой А." },
    {
      time: new Date("20 Jule 2023 02:00 UTC").toISOString(),
      text: "Нотариальное действие ID 028-336 успешно внесено в реестр",
    },
    { time: new Date("19 Jule 2023 7:48 UTC").toISOString(), text: "Профиль пользователя изменен" },
    { time: new Date("17 Jule 2023 1:48 UTC").toISOString(), text: "Новый пользователь успешно добавлен" },
  ];

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const getTimeAgo = (isoDate: string): string => {
    const timeDiff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

    if (timeDiff < 60) {
      return `${timeDiff} ${t("мин")}`;
    } else if (timeDiff < 3600) {
      const minutes = Math.floor(timeDiff / 60);
      return `${minutes} ${minutes === 1 ? t("мин") : minutes < 5 ? t("мин") : t("мин")}`;
    } else if (timeDiff < 86400) {
      const hours = Math.floor(timeDiff / 3600);
      return `${hours} ${hours === 1 ? t("час") : hours < 5 ? t("часа") : t("часов")}`;
    } else {
      const days = Math.floor(timeDiff / 86400);
      return `${days} ${days === 1 ? t("день") : days < 5 ? t("дня") : t("дней")}`;
    }
  };

  useEffect(() => {
    setNotifications(sampleData);
  }, []);

  return (
    <>
      <IconButton aria-label="notifications" onClick={handleNotificationsClick} sx={{ padding: 0 }}>
        <NotificationsIcon fontSize="medium" color="success" />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleNotificationsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            boxShadow: "0px 10px 20px 0px #E9E9E9",
            width: { xs: "100%", sm: "100%", md: "320px" },
          }}
        >
          {notifications.map((notification) => (
            <Box
              key={notification.time}
              sx={{
                padding: "15px 10px 15px 15px",
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                alignItems: "flex-start",
                borderBottom: "1px solid #F6F6F6",
              }}
            >
              <CircleIcon color="success" sx={{ width: "12px", height: "12px" }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Typography
                  fontSize={14}
                  color="textPrimary"
                  sx={{
                    maxHeight: "39px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {notification.text}
                </Typography>
                <Typography fontSize={12} color="textSecondary">
                  {getTimeAgo(notification.time)}
                </Typography>
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "15px 10px 15px 15px",
              gap: "15px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button
              href="/notifications"
              variant="text"
              color="success"
              sx={{
                "&:hover": { backgroundColor: "unset", color: "success" },
                padding: "unset",
              }}
            >
              <Typography fontSize={14}>{t("Все уведомления")}</Typography>
            </Button>
            <Button
              onClick={handleNotificationsClose}
              variant="text"
              sx={{
                "&:hover": { backgroundColor: "unset", color: "secondary" },
                padding: "unset",
              }}
            >
              <Typography fontSize={14} color="#687C9B">
                {t("Закрыть")}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
