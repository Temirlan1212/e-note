import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Box, Popover, IconButton, Badge, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { useProfileStore } from "../stores/profile";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import Button from "@/components/ui/Button";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import { INotification } from "@/models/notification";
import { useIntersect } from "@/hooks/useIntersect";
import { IUserData } from "@/models/user";

export default function PopupNotifications() {
  const t = useTranslations();
  const router = useRouter();
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const { inView } = useIntersect(lastItemRef);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [limit, setLimit] = useState(5);
  const [userData, setUserData] = useState<IUserData | null>(null);

  const profile = useProfileStore((state) => state);

  const { data: readData, update: readMessage } = useFetch("", "POST");
  const { data: deletedData, update: deleteMessage } = useFetch("", "POST");

  const { data: notifications, update, loading } = useFetch<FetchResponseBody<INotification[]>>("", "POST");

  const handleFetchNotifications = async () => {
    await update("/api/notifications", {
      pageSize: limit,
    });
  };

  const handleNotificationPopupToggle = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
    if (anchorEl == null) {
      await handleFetchNotifications();
    }
  };

  const handleRead = async (notification: INotification) => {
    if (notification?.linkToChat) {
      const href = `${notification.linkToChat}?AuthorizationBasic=${notification.chatToken.replace(
        /Basic /,
        ""
      )}` as string;
      window.open(href, "_blank");
    }
    if (notification["message.subject"]) {
      await readMessage("/api/notifications/isRead", {
        id: notification.id,
        version: notification.version,
      });
      router.push(`/applications/status/${notification["message.relatedId"]}`);
    }
  };

  const handleDelete = async (notification: INotification) => {
    await deleteMessage("/api/notifications/isArchived", {
      id: notification.id,
      version: notification.version,
    });
  };

  useEffectOnce(() => {
    handleFetchNotifications();
  }, [limit, readData, deletedData]);

  useEffectOnce(() => {
    setUserData(profile.userData);
  }, [profile.userData]);

  useEffect(() => {
    if (inView && !loading && limit <= notifications?.total!) {
      setLimit(limit + 5);
    }
  }, [inView]);

  const isUnreadNotification = () => {
    if (notifications?.data?.length!) {
      return notifications?.data?.some((notification) => !notification.isRead);
    }
  };

  const getTimeAgo = (notification: INotification): string => {
    const timeDiff = Math.floor((Date.now() - new Date(notification.createdOn).getTime()) / 1000);
    if (notification.linkToChat) return "";

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

  return (
    <>
      {userData && (
        <IconButton onClick={handleNotificationPopupToggle} sx={{ color: "inherit" }}>
          <Badge color="success" variant="dot" invisible={!isUnreadNotification()}>
            {!!anchorEl ? <NotificationsIcon color="success" /> : <NotificationsOutlinedIcon color="inherit" />}
          </Badge>
        </IconButton>
      )}

      <Popover
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
        <List
          sx={{
            width: { xs: "100%", sm: "100%", md: "320px" },
            boxShadow: "6px -14px 20px 0px rgba(0, 0, 0, 0.5)",
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {notifications?.data?.length! ? (
            notifications?.data?.map((notification, idx) => (
              <ListItem
                key={notification.id}
                sx={{
                  padding: "0",
                  cursor: "pointer",
                  borderBottom: "1px solid #F6F6F6",
                  "&:hover": {
                    backgroundColor: "#F6F6F6",
                  },
                }}
              >
                <ListItemText
                  onClick={() => handleRead(notification)}
                  sx={{
                    padding: "10px 0 10px 15px",
                    wordBreak: "break-word",
                  }}
                  primary={
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={notification.isRead}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      {notification?.displayName || t(notification["message.subject"])}
                    </Badge>
                  }
                  secondary={getTimeAgo(notification)}
                />
                {notification["message.subject"] && (
                  <IconButton onClick={() => handleDelete(notification)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText sx={{ fontWeight: 600 }} color="textPrimary" primary={t("No notifications")} />
            </ListItem>
          )}
          <Box ref={lastItemRef} />
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <CircularProgress />
            </Box>
          )}
        </List>
        <Box sx={{ padding: "10px" }}>
          <Button
            onClick={handleNotificationPopupToggle}
            variant="text"
            buttonType="secondary"
            sx={{
              fontSize: "14px",
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
