import { Box } from "@mui/material";
import React from "react";
import ChatListBoard from "./ChatListBoard";
import ChatRightPart from "./ChatRightPart";

interface IChatContentProps {}

const ChatContent = (props: IChatContentProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "30px",
      }}
    >
      <ChatListBoard />
      <ChatRightPart />
    </Box>
  );
};

export default ChatContent;
