import { Avatar, Box, Typography } from "@mui/material";

interface IChatListItemProps {
  activeContact?: number;
  onContactClick: (contactId: number) => void;
  contactId: number;
  contactName: string;
}

const ChatListItem = (props: IChatListItemProps) => {
  const { activeContact, onContactClick, contactId, contactName } = props;

  return (
    <Box
      sx={{
        py: "12px",
        px: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        background: activeContact === contactId ? "#24334B" : "#fff",
        boxShadow: activeContact === contactId ? "0 8px 10px 0 #ACBBD2" : "none",
        cursor: "pointer",
        ":hover": {
          background: "#24334B",
          boxShadow: "0 8px 10px 0 #ACBBD2",
          "& .username": {
            color: "#fff",
          },
        },
      }}
      onClick={() => onContactClick(contactId)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Avatar
          sizes="100"
          sx={{
            bgcolor: "success.main",
            width: "40px",
            height: "40px",
          }}
          aria-label="recipe"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            className="username"
            sx={{
              color: activeContact === contactId ? "#fff" : "#24334B",
              fontSize: "16px",
            }}
          >
            {contactName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatListItem;
