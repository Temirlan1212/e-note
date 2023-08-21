import { FC } from "react";

import { Avatar, Box, IconButton, Typography } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";

interface IChatRightPartProps {
  name: string;
  activeContactId?: number;
  sourceLink?: string;
}

const ChatMessageBoard: FC<IChatRightPartProps> = (props) => {
  const { activeContactId, name, sourceLink } = props;

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
              sx={{
                color: "#fff",
                fontSize: "16px",
              }}
            >
              {name}
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
      <iframe src={sourceLink} width={"100%"} height={"100%"} style={{ minHeight: 400 }} />
    </Box>
  );
};

export default ChatMessageBoard;
