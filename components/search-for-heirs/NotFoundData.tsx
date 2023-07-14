import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import NotFoundImage from "../../public/icons/NotFoundImage.svg";
import NotFoundImageMobile from "../../public/icons/NotFoundImageMobile.svg";

type NotFoundDataProps = {};

const NotFoundData = (props: NotFoundDataProps) => {
  const matches = useMediaQuery("(min-width:500px)");

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
      {matches ? <NotFoundImage /> : <NotFoundImageMobile />}
    </Box>
  );
};

export default NotFoundData;
