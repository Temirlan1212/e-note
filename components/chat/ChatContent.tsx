import { FC, useEffect, useState } from "react";

import { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import { Box, Button, Typography } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

import ChatListBoard from "./contact-list/ChatListBoard";
import ChatMessageBoard from "./message/ChatMessageBoard";

import AvatarContact from "@/public/images/avatar-contact.png";

interface IChatContentProps {}

export interface IContact {
  id: number;
  name: string;
  phoneNumber: string;
  online: boolean;
  avatar: StaticImageData;
  messages?: Message[];
  isRead: boolean;
}

export interface Message {
  id: number;
  text: string;
  sender: string;
  createAt: string;
}

const contacts: IContact[] = [
  {
    id: 1,
    name: "Баланчаева Б.Б.",
    phoneNumber: "123-456-7890",
    isRead: true,
    online: true,
    avatar: AvatarContact,
    messages: [
      { id: 1, text: "Hello there!", sender: "other", createAt: "14:15" },
      { id: 2, text: "Hi! How are you?", sender: "user", createAt: "14:18" },
      { id: 3, text: "I'm doing well. Thanks!", sender: "other", createAt: "14:23" },
    ],
  },
  {
    id: 2,
    name: "Баланчаева Б.Б.",
    phoneNumber: "987-654-3210",
    isRead: false,
    online: false,
    avatar: AvatarContact,
    messages: [{ id: 1, text: "Hello there!", sender: "other", createAt: "14:15" }],
  },
  {
    id: 3,
    name: "Баланчаева Б.Б.",
    phoneNumber: "987-654-3210",
    isRead: true,
    online: false,
    avatar: AvatarContact,
    messages: [
      { id: 1, text: "Hello there!", sender: "other", createAt: "14:15" },
      { id: 2, text: "Hi! How are you?", sender: "user", createAt: "14:18" },
    ],
  },
  {
    id: 4,
    name: "Баланчаева Б.Б.",
    phoneNumber: "987-654-3210",
    isRead: false,
    online: true,
    avatar: AvatarContact,
    messages: [
      { id: 1, text: "Hello there!", sender: "other", createAt: "14:15" },
      { id: 2, text: "Hi! How are you?", sender: "user", createAt: "14:18" },
      { id: 3, text: "I'm doing well. Thanks!", sender: "other", createAt: "14:23" },
    ],
  },
  {
    id: 5,
    name: "Алапаев Н.К.",
    isRead: false,
    phoneNumber: "987-654-3210",
    online: false,
    avatar: AvatarContact,
    messages: [],
  },
];

const ChatContent: FC<IChatContentProps> = (props: IChatContentProps) => {
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeContact = contacts.find((contact) => contact.id === activeContactId) || null;

  const [messages, setMessages] = useState<Message[]>(activeContact?.messages || []);

  useEffect(() => {
    setMessages(activeContact?.messages || []);
  }, [activeContact]);

  const handleSendMessage = (text: string) => {
    const now = new Date();

    const hoursAndMinutes = now.getHours() + ":" + now.getMinutes();

    const newMessage: Message = { id: contacts.length + 1, text, sender: "user", createAt: hoursAndMinutes };

    setMessages((prevMessages) => {
      return [...prevMessages, newMessage];
    });
  };

  const handleContactClick = (contactId: number) => {
    setActiveContactId(contactId);

    const contact: any = contacts.find((contact) => contact.id === activeContactId);

    const updatedContact: IContact = { ...contact, isRead: true };

    const contactIndex = contacts.findIndex((c) => c.id === updatedContact.id);

    contacts[contactIndex] = updatedContact;
  };

  const onBackToContacts = () => {
    setActiveContactId(null);
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
            activeContactId={activeContact?.id}
            avatar={activeContact?.avatar}
            contactOnline={activeContact?.online}
            name={activeContact?.name}
            messages={messages}
            onSend={handleSendMessage}
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
