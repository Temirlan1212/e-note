import Head from "next/head";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import Accordion from "@/components/ui/Accordion";
import React from "react";
import Image from "next/image";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import HeirNotFoundData from "@/components/search-for-heirs/components/HeirNotFoundData";

interface QAData extends FetchResponseBody {
  data: {
    answerNot: string;
    id: number;
    questionNot: string;
    version: number;
  }[];
}

export default function QaForNotaries() {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState<number | false>(0);

  const { data, loading } = useFetch<QAData>("/api/qa/notary", "POST");

  const handleQAExpanding = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
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

      <Container
        maxWidth="xl"
        sx={{
          py: "50px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={{ xs: "20px", lg: "110px" }}>
          {data && (
            <Box width={340} height={600} display={{ xs: "none", md: "flex" }} alignItems="center">
              <Image src="/images/qa.png" alt="E-notariat" width={340} height={600} layout="responsive" />
            </Box>
          )}

          <Box maxWidth={{ xs: 600, lg: 700 }} margin="auto">
            <Typography variant="h1" fontWeight={600} marginBottom="20px">
              {t("Questions and answers")}
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            ) : data && Array.isArray(data?.data) ? (
              data?.data.map(({ questionNot, answerNot }, index) => (
                <Accordion
                  key={questionNot}
                  expanded={expanded === index}
                  title={questionNot}
                  type={questionNot}
                  handleChange={handleQAExpanding(index)}
                  sx={{ bgcolor: "transparent" }}
                >
                  {answerNot}
                </Accordion>
              ))
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <HeirNotFoundData />
              </Box>
            )}
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
