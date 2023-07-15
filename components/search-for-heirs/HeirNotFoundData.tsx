import React from "react";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

import HeirNotFoundImage from "../../public/images/HeirNotFoundImage.png";

type IHeirNotFoundDataProps = {};

const HeirNotFoundData = (props: IHeirNotFoundDataProps) => {
  const t = useTranslations();

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
      <Box
        sx={{
          maxWidth: {
            xs: "180px",
            sm: "320px",
          },
        }}
      >
        <Image
          src={HeirNotFoundImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          alt="HeirNotFoundImage"
        />
      </Box>
    </Box>
  );
};

export default HeirNotFoundData;
