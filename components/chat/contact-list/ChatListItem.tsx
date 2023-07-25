import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import { Avatar, Box, Typography } from "@mui/material";

interface IChatListItemProps {
  activeContact: any;
  onContactClick: (contactId: number) => void;
  contactId: number;
  contactName: string;
  contactOnline: boolean;
  avatar: StaticImageData;
  isRead: boolean;
}

const ChatListItem = (props: IChatListItemProps) => {
  const { activeContact, onContactClick, contactId, contactName, contactOnline, avatar, isRead } = props;

  const t = useTranslations();

  return (
    <Box
      sx={{
        py: "12px",
        px: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        background: activeContact === contactId ? "#24334B" : "#fff",
        boxShadow: activeContact === contactId ? "0 8px 10px 0 #ACBBD2" : "none",
        cursor: "pointer",
        ":hover": {
          background: "#24334B",
          boxShadow: "0 8px 10px 0 #ACBBD2",
          "& .username": {
            color: "#fff",
          },
        },
      }}
      onClick={() => onContactClick(contactId)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {avatar ? (
          <Avatar
            sizes="100"
            sx={{
              bgcolor: "success.main",
              width: "40px",
              height: "40px",
            }}
            aria-label="recipe"
          >
            <Image src={avatar} alt="contact-profile" />
          </Avatar>
        ) : (
          <Avatar
            sizes="100"
            sx={{
              bgcolor: "success.main",
              width: "40px",
              height: "40px",
            }}
            aria-label="recipe"
          />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            className="username"
            sx={{
              color: activeContact === contactId ? "#fff" : "#24334B",
              fontSize: "16px",
            }}
          >
            {contactName}
          </Typography>
          <Typography
            sx={{
              color: contactOnline ? "#1BAA75" : "#BDBDBD",
              fontSize: "14px",
            }}
          >
            {contactOnline ? t("online") : t("offline")}
          </Typography>
        </Box>
      </Box>

      {isRead ? (
        ""
      ) : (
        <Box
          sx={{
            width: "10px",
            height: "10px",
            background: "#1BAA75",
            borderRadius: "50%",
          }}
        />
      )}
    </Box>
  );
};

export default ChatListItem;
