import React from "react";

import { Avatar, Box, Typography } from "@mui/material";
import Input from "../ui/Input";
import { PermIdentity } from "@mui/icons-material";

interface IChatListBoardProps {}

const ChatListBoard = (props: IChatListBoardProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        minWidth: "320px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          background: "#F6F6F6",
          height: "64px",
        }}
      >
        <Typography
          sx={{
            color: "#24334B",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Ваши сообщения
        </Typography>
      </Box>
      <Input
        sx={{
          ".MuiInputBase-root": {
            borderRadius: 0,
          },
        }}
        placeholder="Search"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
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
              }}
            >
              Баланчаева Б.Б.
            </Typography>
            <Typography
              sx={{
                color: "#1BAA75",
              }}
            >
              онлайн
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatListBoard;
