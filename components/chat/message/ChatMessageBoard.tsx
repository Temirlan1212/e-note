import { FC, useEffect, useRef, useState } from "react";

import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import { Avatar, Box, IconButton, Typography } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import Input from "../../ui/Input";
import Button from "../../ui/Button";
import MessageItem from "./ChatMessageItem";
import { Message } from "../ChatContent";

interface IChatRightPartProps {
  avatar?: StaticImageData;
  contactOnline?: boolean;
  name?: string;
  onSend: (text: string) => void;
  messages?: Message[];
  activeContactId?: number;
}

const ChatMessageBoard: FC<IChatRightPartProps> = (props) => {
  const { avatar, contactOnline, name, onSend, messages, activeContactId } = props;

  const [messageText, setMessageText] = useState("");

  const t = useTranslations();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSend = () => {
    if (messageText.trim() !== "") {
      onSend(messageText);
      setMessageText("");
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      flexDirection="column"
      width="100%"
      sx={{
        display: {
          xs: activeContactId ? "flex" : "none",
          md: "flex",
        },
      }}
    >
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
              sx={{
                color: "#fff",
                fontSize: "16px",
              }}
            >
              {name}
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
        <IconButton
          sx={{
            "& svg": {
              color: "white",
            },
          }}
        >
          <MoreVert />
        </IconButton>
      </Box>
      <Box
        sx={{
          height: "400px",
          overflowY: "auto",
          py: "20px",
          px: "7px",
        }}
        ref={messagesContainerRef}
      >
        {messages?.map((message) => <MessageItem key={message.id} message={message} />)}
      </Box>
      <Box display="flex">
        <Input
          fullWidth
          name={name}
          placeholder={t("Your messages")}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <Button
          sx={{
            width: "80px",
            boxShadow: 0,
            ":hover": {
              boxShadow: 0,
            },
          }}
          color="success"
          onClick={handleSend}
        >
          <SendOutlinedIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatMessageBoard;
