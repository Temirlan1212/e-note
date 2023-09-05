import { ChangeEvent, FC } from "react";

import { useTranslations } from "next-intl";

import { Box, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

import Input from "../../ui/Input";
import ChatListItem from "./ChatListItem";

interface IChatListBoardProps {
  handleContactClick: (id: number) => void;
  activeContact?: { name: string; id: number };
  users: Array<{ name: string; id: number }>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ChatListBoard: FC<IChatListBoardProps> = (props) => {
  const { handleContactClick, activeContact, users, searchQuery, setSearchQuery } = props;

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
          xs: activeContact?.id ? "none" : "flex",
          md: "flex",
        },
        width: {
          xs: "100%",
          md: "320px",
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
              key={user.id}
              activeContact={activeContact?.id}
              contactName={user.name}
              contactId={user.id}
              onContactClick={() => handleContactClick(user.id)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ChatListBoard;
