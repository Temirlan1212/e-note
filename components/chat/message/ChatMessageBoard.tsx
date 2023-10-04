import { FC } from "react";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Avatar, Box, Typography } from "@mui/material";

interface IChatRightPartProps {
  name?: string;
  chatCreator?: string;
  chatLink?: string;
  userToken?: string;
}

const ChatMessageBoard: FC<IChatRightPartProps> = ({ name, chatCreator, chatLink, userToken }) => {
  const t = useTranslations();

  return (
    <Box display="flex" flexDirection="column" width="100%" gap="16px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: "12px",
          px: "16px",
          height: "64px",
          background: "#3F5984",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Avatar
            sizes="100"
            sx={{
              bgcolor: "success.main",
              width: "40px",
              height: "40px",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "16px",
              }}
            >
              {name ? name : t("Chat is not available")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "16px",
          background: "#F6F6F6",
        }}
      >
        {chatLink && userToken ? (
          <Link
            href={`${chatLink}?AuthorizationBasic=${userToken.replace(/Basic /, "")}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("Start chatting")}
          </Link>
        ) : (
          <Typography sx={{ fontSize: "16px" }}>{t("Select a chat from the list on the left")}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessageBoard;
