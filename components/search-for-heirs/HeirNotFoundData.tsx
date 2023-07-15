import React from "react";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

// import HeirNotFoundImage from ;

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
        <Box
          component="img"
          sx={{
            height: { xs: "200px", sm: "390px" },
            width: { xs: "170px", sm: "330px" },
          }}
          alt="Heir Not Found"
          src="/images/HeirNotFoundImage.svg"
        />
      </Box>
    </Box>
  );
};

export default HeirNotFoundData;
