import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

interface IChatListItemProps {}

const ChatListItem = (props: IChatListItemProps) => {
  return (
    <Box
      sx={{
        py: "12px",
        px: "16px",
        display: "flex",
        alignItems: "center",
        height: "64px",
        gap: "16px",
        background: "#24334B",
        boxShadow: "0px 10px 20px 0px #ACBBD2",
        cursor: "pointer",
        transition: "all .3s ease",
        ":hover": {
          background: "#24334B",
          boxShadow: "0px 10px 20px 0px #ACBBD2",
        },
      }}
    >
      <Avatar
        sizes="100"
        sx={{
          bgcolor: "success.main",
          width: "40px",
          height: "40px",
        }}
        aria-label="recipe"
      ></Avatar>
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
          Баланчаева Б.Б.
        </Typography>
        <Typography
          style={{
            fontSize: "14px",
          }}
          sx={{
            color: "#1BAA75",
          }}
        >
          онлайн
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatListItem;
