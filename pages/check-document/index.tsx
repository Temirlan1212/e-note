import React, { ReactNode, useState } from "react";
import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import Button from "@/components/ui/Button";
import CheckByID from "@/components/check-document/CheckByID";
import CheckByQR from "@/components/check-document/CheckByQR";
import CheckByPDF from "@/components/check-document/CheckByPDF";
import CheckByUniqNumber from "@/components/check-document/CheckByUniqNumber";

const Tabs: Record<number, ReactNode> = {
  1: <CheckByID />,
  2: <CheckByQR />,
  3: <CheckByPDF />,
  4: <CheckByUniqNumber />,
};

export default function CheckDocument() {
  const t = useTranslations();
  const [docId, setDocId] = useState(1);

  const handleDocClick = (id: number) => {
    setDocId(id);
  };

  const tabs = [
    {
      id: 1,
      text: "By document ID",
      click: () => handleDocClick(1),
    },
    {
      id: 2,
      text: "By QR code",
      click: () => handleDocClick(2),
    },
    {
      id: 3,
      text: "By PDF",
      click: () => handleDocClick(3),
    },
    {
      id: 4,
      text: "By Unique number",
      click: () => handleDocClick(4),
    },
  ];

  return (
    <>
      <Head>
        <title>{t("Check document")}</title>
      </Head>
      <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", gap: "30px", py: "50px" }}>
        <Typography align="center" fontSize={{ xs: "24px", sm: "24px", md: "36px" }} fontWeight={600}>
          {t("Check document")}
        </Typography>
        <Box display="flex" gap="10px" flexDirection={{ xs: "column", md: "row" }}>
          {tabs.map((tab) => {
            const isActive = docId === tab.id;

            return (
              <Button
                key={tab.id}
                variant={isActive ? "contained" : "text"}
                sx={{
                  fontSize: { sm: "12px", md: "16px" },
                  boxShadow: isActive ? "0px 10px 20px 0px #99DBAF" : "",
                  background: isActive ? "" : "#EFEFEF",
                  padding: "10px 0",
                  "&:hover": {
                    color: "#EFEFEF",
                  },
                }}
                onClick={tab.click}
              >
                {t(tab.text)}
              </Button>
            );
          })}
        </Box>
        {Tabs[docId]}
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/check-document.json`)).default,
        ...(await import(`locales/${context.locale}/validator.json`)).default,
      },
    },
  };
}
