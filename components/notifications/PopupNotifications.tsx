import React, { useEffect, useState } from "react";
import { Typography, Box, Popover, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";

import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import Button from "@/components/ui/Button";
import { useProfileStore } from "../../stores/profile";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";

interface IRequestBody {
  sortBy: Array<string>;
  criteria: Array<{
    fieldName: string;
    operator: string;
    value: string;
  }> | null;
  operator: string | null;
}

export default function PopupNotifications() {
  const [notifications, setNotifications] = useState<{ createdOn: string; message: string }[]>([]);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const t = useTranslations();

  const [requestBody, setRequestBody] = useState<IRequestBody>({
    sortBy: [""],
    criteria: null,
    operator: null,
  });

  const { data: messages } = useFetch("/api/notifications/", "POST", {
    body: requestBody,
  });

  const user = useProfileStore((state) => state.getUserData());

  const handleNotificationPopupToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
  };

  const getTimeAgo = (isoDate: string): string => {
    const timeDiff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

    if (timeDiff < 60) {
      return `${timeDiff} ${t("min")}`;
    } else if (timeDiff < 3600) {
      const minutes = Math.floor(timeDiff / 60);
      return `${minutes} ${minutes === 1 ? t("min") : minutes < 5 ? t("min") : t("min")}`;
    } else if (timeDiff < 86400) {
      const hours = Math.floor(timeDiff / 3600);
      return `${hours} ${hours === 1 ? t("hour") : hours < 5 ? t("hourGenitive") : t("hourAccusative")}`;
    } else {
      const days = Math.floor(timeDiff / 86400);
      return `${days} ${days === 1 ? t("day") : days < 5 ? t("dayGenitive") : t("dayAccusative")}`;
    }
  };

  useEffect(() => {
    setRequestBody((prev: any) => {
      return {
        ...prev,
        sortBy: ["createdOn", "updatedOn"],
        operator: "and",
        criteria: [
          {
            fieldName: "user.id",
            operator: "=",
            value: user?.id ?? "",
          },
        ],
      };
    });
    console.log("userR", requestBody);
    console.log("userM", messages);
  }, [messages != "" && null && undefined]);

  useEffect(() => {
    if (messages) {
      setNotifications(messages?.data);
      console.log("userN", notifications);
    }
  }, [handleNotificationPopupToggle]);

  return (
    <>
      <IconButton aria-label="notifications" onClick={handleNotificationPopupToggle} sx={{ padding: 0 }}>
        <NotificationsIcon fontSize="medium" color="success" />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleNotificationPopupToggle}
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
          {notifications &&
            notifications.length > 0 &&
            notifications.map((notification) => (
              <Box
                key={notification.createdOn}
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
                    {notification.message}
                  </Typography>
                  <Typography fontSize={12} color="textSecondary">
                    {getTimeAgo(notification.createdOn)}
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
              onClick={handleNotificationPopupToggle}
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
