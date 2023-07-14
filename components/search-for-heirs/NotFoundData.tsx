import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";

import NotFoundImage from "../../public/icons/NotFoundImage.svg";
import NotFoundImageMobile from "../../public/icons/NotFoundImageMobile.svg";

type NotFoundDataProps = {};

const NotFoundData = (props: NotFoundDataProps) => {
  const t = useTranslations();

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
        {t("Nothing has been found yet")}
      </Typography>
      {matches ? <NotFoundImage /> : <NotFoundImageMobile />}
    </Box>
  );
};

export default NotFoundData;
