import { ChangeEvent, FC } from "react";

import { useTranslations } from "next-intl";

import { Box, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

import Input from "../../ui/Input";
import ChatListItem from "./ChatListItem";
import { IContact } from "@/models/chat";

interface IChatListBoardProps {
  handleContactClick: (chatId: number) => void;
  activeContact?: IContact;
  users: IContact[];
  searchQuery: string;
  partnerName?: string;
  setSearchQuery: (query: string) => void;
}

const ChatListBoard: FC<IChatListBoardProps> = (props) => {
  const { handleContactClick, activeContact, users, partnerName, searchQuery, setSearchQuery } = props;

  const t = useTranslations();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="16px"
      sx={{
        display: {
          xs: activeContact?.chatId ? "none" : "flex",
          md: "flex",
        },
        width: {
          xs: "100%",
          md: "500px",
        },
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
        onChange={handleChange}
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
        {users?.map((user) => {
          return (
            <ChatListItem
              key={user.chatId}
              activeContact={activeContact?.chatId}
              contactName={partnerName === user.guest ? user.chatCreator : user.guest}
              contactId={user.chatId}
              onContactClick={() => handleContactClick(user.chatId)}
              chatLink={user.chatRoomLink}
              userToken={user.userToken}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ChatListBoard;
