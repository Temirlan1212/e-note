import React from "react";
import Image from "next/image";
import { Typography, Box, InputLabel } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

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
      <InputLabel htmlFor="not-found-data-img">
        <Typography fontSize={{ xs: "18px", md: "24px" }} fontWeight={600}>
          {t("Nothing found yet")}
        </Typography>
      </InputLabel>
      <Image height={260} width={320} alt="Not found" src="/images/not-found-data.svg" />
    </Box>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/check-power-of-attorney.json`)).default,
      },
    },
  };
}
