import { Box, Typography } from "@mui/material";
import React from "react";
import NotFoundImage from "../../public/icons/NotFoundImage.svg";

type NotFoundDataProps = {};

const NotFoundData = (props: NotFoundDataProps) => {
  return (
    <Box
      sx={{
        margin: "50px auto 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "12px",
      }}
    >
      <Typography
        sx={{
          color: "#9A9A9A",
          fontWeight: 600,
        }}
      >
        Пока ничего не найдено
      </Typography>
      <NotFoundImage />
    </Box>
  );
};

export default NotFoundData;
