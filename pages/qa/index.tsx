import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import Accordion from "@/components/ui/Accordion";
import React from "react";
import Image from "next/image";

const qaTypesData = [
  {
    title: "What is a power of attorney?",
    text: "QA-text-1",
  },
  {
    title: "What is needed to provide proof?",
    text: "QA-text-2",
  },
  {
    title: "For how long and when is the Certificate of Inheritance issued?",
    text: "QA-text-3",
  },
  {
    title: "For how long can I make a Power of Attorney for the management and disposal of property?",
    text: "QA-text-4",
  },
];

export default function QA() {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState<number | false>(0);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (expanded === panel) {
      setExpanded(false);
    } else {
      setExpanded(panel);
    }
  };

  return (
    <>
      <Head>
        <title>{t("Questions and answers")}</title>
      </Head>

      <Container>
        <Box
          component="section"
          py={5}
          display="flex"
          justifyContent="space-between"
          gap={{ xs: "20px", lg: "110px" }}
          alignItems="center"
        >
          <Box width={340} height={600} display={{ xs: "none", md: "flex" }} alignItems="center">
            <Image src="/images/qa.png" alt="E-notariat" width={340} height={600} layout="responsive" />
          </Box>

          <Box maxWidth={{ xs: 600, lg: 700 }} margin="auto">
            <Typography variant="h1" fontWeight={600} marginBottom="20px">
              {t("Questions and answers")}
            </Typography>

            {qaTypesData.map(({ title, text }, index) => (
              <Accordion
                key={title}
                expanded={expanded === index}
                title={title}
                type={title}
                handleChange={handleChange(index)}
                sx={{ bgcolor: "transparent" }}
              >
                {t(text)}
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/qa.json`)).default,
      },
    },
  };
}
