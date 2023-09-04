import { FC, useState } from "react";

import { useTranslations } from "next-intl";

import { Box, Button, Typography } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

import ChatListBoard from "./contact-list/ChatListBoard";
import ChatMessageBoard from "./message/ChatMessageBoard";

import useFetch from "@/hooks/useFetch";

interface IContact {
  status: number;
  data: {
    appName: string;
    chatCreator: string;
    chatId: number;
    chatRoomLink: string;
    guestEmail: null;
    guestId: number;
    notary: {
      id: number;
    };
    userToken: string;
  };
}

const ChatContent: FC = () => {
  const [activeContactId, setActiveContactId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();

  const { data } = useFetch("/api/profile/users", "POST");
  const { data: contact, update } = useFetch<IContact>("", "POST");

  const handleContactClick = (contactId: number) => {
    update(`/api/chat/create/${contactId}`, { id: contactId });
    setActiveContactId(contactId);
  };

  const filteredUsers: Array<{ name: string; id: number }> = data?.data?.filter((user: { name: string; id: number }) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = filteredUsers?.find((user) => user.id === activeContactId);

  const onBackToContacts = () => {
    setActiveContactId(0);
  };

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
            xs: activeContact?.id ? "flex" : "none",
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
          <ChatMessageBoard name={contact?.data?.appName} chatLink={contact?.data?.chatRoomLink} />
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
