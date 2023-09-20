import { FC, useState } from "react";

import { useTranslations } from "next-intl";

import { Box, Button, Typography } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

import ChatListBoard from "./contact-list/ChatListBoard";
import ChatMessageBoard from "./message/ChatMessageBoard";

import useFetch from "@/hooks/useFetch";
import { IContact } from "@/models/chat";

interface IContactData {
  status: number;
  data: IContact[];
}

const ChatContent: FC = () => {
  const [activeContactId, setActiveContactId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();

  const { data } = useFetch<IContactData>("/api/chat", "GET");

  const handleContactClick = (contactId: number) => {
    setActiveContactId(contactId);
  };

  const filteredUsers = (data?.data ?? []).filter(
    (user) => user?.appName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = filteredUsers?.find((user) => user.chatId === activeContactId);

  const onBackToContacts = () => {
    setActiveContactId(0);
  };

  const contact = (data?.data ?? []).find((user) => user.chatId === activeContactId);

  return (
    <>
      <Button
        startIcon={
          <KeyboardBackspaceOutlinedIcon
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
        }
        sx={{
          color: "#1BAA75",
          fontSize: "16px",
          display: {
            xs: activeContact?.chatId ? "flex" : "none",
            md: "none",
          },
          margin: "0 0 20px auto",
        }}
        onClick={onBackToContacts}
      >
        {t("Back")}
      </Button>

      <Box
        sx={{
          display: "flex",
          gap: "30px",
        }}
      >
        <ChatListBoard
          users={filteredUsers}
          handleContactClick={handleContactClick}
          activeContact={activeContact}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {activeContact ? (
          <ChatMessageBoard
            name={contact?.appName}
            chatCreator={contact?.chatCreator}
            chatLink={contact?.chatRoomLink}
          />
        ) : (
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
            width="100%"
            alignItems="center"
            border="2px solid #efefef"
            justifyContent="center"
          >
            <Typography fontSize="24px">{t("Choose an interlocutor")}</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChatContent;
