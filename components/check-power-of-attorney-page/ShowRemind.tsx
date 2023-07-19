import React from "react";
import Image from "next/image";
import { Box, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

export default function ShowRemind({ closeRemind, iconUrl, documentFound, remindTitle, remindText }) {
  const t = useTranslations();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "auto",
          width: "auto",
          padding: "16px",
          gap: "5px",
          boxShadow: "0px 10px 20px 0px #E9E9E9",
          justifyContent: "space-between",
        }}
      >
        {!documentFound ? (
          <Typography color="textSecondary" display="flex" flexDirection="column">
            <Typography fontWeight={400}>
              {t("Each notarial document has its unique number, consisting of n-characters. Click on the ")}
              <Link href="/unique-number" color="#1BAA75">
                {t("link")}
              </Link>
              {t(" to find out how to get it.")}
            </Typography>
          </Typography>
        ) : (
          <Typography color="textSecondary" display="flex" flexDirection="column">
            <Typography fontWeight={600}>{t(remindTitle)}</Typography>
            <Typography fontWeight={400}>{t(remindText)}</Typography>
          </Typography>
        )}

        <Image alt="#" src={iconUrl} onClick={closeRemind} width={24} height={24} style={{ cursor: "pointer" }} />
      </Box>
    </>
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
