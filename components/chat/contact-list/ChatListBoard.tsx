import { FC } from "react";

import { useTranslations } from "next-intl";

import { Box, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

import Input from "../../ui/Input";
import ChatListItem from "./ChatListItem";
import { IContact } from "../ChatContent";

interface IChatListBoardProps {
  setSearchQuery: (query: string) => void;
  filteredContacts: IContact[];
  handleContactClick: (id: number) => void;
  activeContact: IContact | null;
  searchQuery: string;
}

const ChatListBoard: FC<IChatListBoardProps> = (props) => {
  const { setSearchQuery, filteredContacts, handleContactClick, activeContact, searchQuery } = props;

  const t = useTranslations();

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        display: {
          xs: activeContact?.id ? "none" : "flex",
          md: "flex",
        },
        width: {
          xs: "100%",
          md: "320px",
        },
        gap: "16px",
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
          {t("Your messages")}
        </Typography>
      </Box>
      <Input
        sx={{
          ".MuiInputBase-root": {
            borderRadius: 0,
            height: "44px",
            fontSize: "14px",
          },
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: <Search />,
        }}
        placeholder={t("Search")}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "400px",
          overflowY: "auto",
        }}
      >
        {filteredContacts.map((contact) => {
          return (
            <ChatListItem
              activeContact={activeContact?.id}
              key={contact.id}
              avatar={contact.avatar}
              contactName={contact.name}
              contactOnline={contact.online}
              contactId={contact.id}
              isRead={contact.isRead}
              onContactClick={() => handleContactClick(contact.id)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ChatListBoard;
