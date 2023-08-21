import { FC, useState } from "react";

import { useTranslations } from "next-intl";

import { Box, Button, Typography } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

import ChatListBoard from "./contact-list/ChatListBoard";
import ChatMessageBoard from "./message/ChatMessageBoard";

import useFetch from "@/hooks/useFetch";

interface IChatContentProps {}

export interface IContact {
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
}

const ChatContent: FC<IChatContentProps> = (props: IChatContentProps) => {
  const [activeContactId, setActiveContactId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();

  const { data: contacts } = useFetch("/api/chat", "GET");

  const filteredContacts: IContact[] = contacts?.data.filter((contact) =>
    contact.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { data: contact, update } = useFetch("", "POST");

  const activeContact = contacts?.data.find((contact) => contact.notary.id === activeContactId);

  const handleContactClick = async (contactId: number) => {
    await update(`/api/chat/create/${contactId}`, { id: contactId });
    setActiveContactId(contactId);
  };

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
            xs: "flex",
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
          setSearchQuery={setSearchQuery}
          filteredContacts={filteredContacts}
          handleContactClick={handleContactClick}
          activeContact={activeContact}
          searchQuery={searchQuery}
        />

        {activeContact ? (
          <ChatMessageBoard
            name={contact?.data.appName}
            sourceLink={contact?.data.chatRoomLink}
            activeContactId={contact?.data.notary.id}
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
