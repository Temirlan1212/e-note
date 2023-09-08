import React, { useEffect, useState } from "react";
import { Typography, Box, Popover, IconButton, Badge } from "@mui/material";
import { useTranslations } from "next-intl";

import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import Button from "@/components/ui/Button";
import { useProfileStore } from "../../stores/profile";
import { IUserData } from "@/models/user";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { INotification } from "@/models/notification";
import { ValueOf } from "next/dist/shared/lib/constants";

interface INotificationData extends FetchResponseBody {
  data: INotification[];
}

interface IAppQueryParams {
  pageSize: number;
  criteria: Array<{
    fieldName: string;
    operator: string;
    value: number;
  }> | null;
}

export default function PopupNotifications() {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 5,
    criteria: null,
  });

  const t = useTranslations();

  const { data: message, update: messageUpdate } = useFetch("", "POST");

  const user: IUserData | null = useProfileStore((state) => state.getUserData());

  const { data: messages, loading } = useFetch<INotificationData>("/api/notifications/", "POST", {
    body: appQueryParams,
  });

  const handleNotificationPopupToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
  };

  const handleRead = (id: number) => {
    messageUpdate(`/api/notifications/isRead/${id}`);
  };

  const getTimeAgo = (isoDate: string): string => {
    const timeDiff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

    if (timeDiff < 60) {
      return `${timeDiff} ${t("sec")}`;
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

  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleChangeLimit = () => {
    if (appQueryParams.pageSize) updateAppQueryParams("pageSize", appQueryParams.pageSize + 4);
  };

  const withBadge = messages && Object.values(messages?.data).find((notification) => !notification.isRead);

  useEffect(() => {
    updateAppQueryParams("criteria", [
      {
        fieldName: "user.id",
        operator: "=",
        value: user?.id ?? 0,
      },
    ]);
  }, [appQueryParams.pageSize, message]);

  useEffect(() => {
    if (messages?.total! > appQueryParams.pageSize) {
      setShowLoadMore(true);
    } else {
      setShowLoadMore(false);
    }
    if (messages?.total === appQueryParams.pageSize) {
      setShowLoadMore(false);
    }
  }, [messages?.data, appQueryParams.pageSize]);

  return (
    <>
      <IconButton onClick={handleNotificationPopupToggle} sx={{ padding: 1, color: "black" }}>
        {!!anchorEl ? (
          <NotificationsIcon color="success" />
        ) : withBadge ? (
          <Badge badgeContent color="success" variant="dot">
            <NotificationsOutlinedIcon color="inherit" />
          </Badge>
        ) : (
          <NotificationsOutlinedIcon color="inherit" />
        )}
      </IconButton>

      <Popover
        sx={{
          maxHeight: "400px",
        }}
        open={!!anchorEl}
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
            justifyContent: "space-between",
            width: { xs: "100%", sm: "100%", md: "320px" },
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {messages?.data?.length ? (
            messages?.data.map((notification) => (
              <Box
                key={notification.id}
                sx={{
                  wordBreak: "break-word",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #F6F6F6",
                  width: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#F6F6F6",
                  },
                }}
                onClick={() => !notification.isRead && handleRead(notification.id)}
              >
                {!notification.isRead && <CircleIcon color="success" sx={{ width: "12px", height: "12px" }} />}
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
                    }}
                  >
                    {t(`${notification.message.subject}`)}
                  </Typography>
                  <Typography fontSize={12} color="textSecondary">
                    {getTimeAgo(notification.createdOn)}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                padding: "15px",
                display: "flex",
                justifyContent: "center",
                borderBottom: "1px solid #F6F6F6",
                width: "100%",
              }}
            >
              <Typography
                fontSize={14}
                alignSelf="center"
                color="textPrimary"
                sx={{
                  fontWeight: 600,
                  maxHeight: "39px",
                }}
              >
                {t("No notifications")}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "10px",
          }}
        >
          {showLoadMore && (
            <Button
              variant="text"
              loading={loading}
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                "&:hover": { backgroundColor: "unset", color: "success" },
                padding: "unset",
              }}
              onClick={handleChangeLimit}
            >
              {t("Show more")}
            </Button>
          )}
          <Button
            onClick={handleNotificationPopupToggle}
            variant="text"
            buttonType="secondary"
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "unset", color: "secondary" },
              padding: "unset",
            }}
          >
            {t("Close")}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
