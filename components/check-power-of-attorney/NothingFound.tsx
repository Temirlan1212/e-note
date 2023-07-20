import React from "react";
import Image from "next/image";
import { Typography, Box } from "@mui/material";
import { useTranslations } from "next-intl";

export default function NothingFound() {
  const t = useTranslations();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Typography fontSize={{ xs: "18px", md: "24px" }} fontWeight={600} color="#9A9A9A">
        {t("Nothing found yet")}
      </Typography>
      <Image width={320} height={260} alt="Not found" src="/images/not-found-data.svg" />
    </Box>
  );
}
