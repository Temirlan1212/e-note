import React from "react";

import { Box, Typography } from "@mui/material";

interface IChatListBoardProps {}

const ChatListBoard = (props: IChatListBoardProps) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          background: "#F6F6F6",
          minWidth: "320px",
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
    </Box>
  );
};

export default ChatListBoard;
