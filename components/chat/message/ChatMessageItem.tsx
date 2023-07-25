import { ListItem, ListItemText, Typography, Box } from "@mui/material";

import { Message } from "../ChatContent";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUserMessage = message.sender === "user";

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        padding: "15px",
        paddingBottom: "25px",
        background: isUserMessage ? "#1BAA75" : "#EFEFEF",
        width: {
          xs: "300px",
          md: "320px",
        },
        color: isUserMessage ? "#fff" : "#24334B",
        fontSize: "14px",
        borderRadius: "5px",
        margin: isUserMessage ? "0 0 5px auto" : "0 auto 5px 0",
        "::before": {
          content: `''`,
          position: "absolute",
          top: "78%",
          right: isUserMessage ? "-7px" : "",
          left: isUserMessage ? "" : "-7px",
          borderWidth: "8px",
          borderStyle: "solid",
          borderColor: isUserMessage
            ? "transparent transparent #1BAA75 transparent"
            : "transparent transparent #EFEFEF transparent",
        },
      }}
      key={message.id}
    >
      <Box
        sx={{
          position: "absolute",
          right: "5px",
          bottom: "5px",
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
          }}
        >
          {message.createAt}
        </Typography>
      </Box>

      <ListItemText
        primary={message.text}
        sx={{
          wordBreak: "break-all",
        }}
      />
    </ListItem>
  );
};

export default MessageItem;
