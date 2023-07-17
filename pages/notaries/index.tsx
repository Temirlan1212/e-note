import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import NotariesFiltration from "@/components/notaries/NotariesFiltration";

export default function About() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Notaries")}</title>
      </Head>

      <Container>
        <Box component="section" py={10} display="flex" justifyContent="space-between" flexDirection="column">
          <Typography
            component="h1"
            sx={{
              fontSize: "36px",
              fontWeight: 600,
              marginBottom: {
                xs: "30px",
                md: "50px",
              },
            }}
          >
            Реестр нотариусов Кыргызской Республики
          </Typography>

          <NotariesFiltration />
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
        ...(await import(`locales/${context.locale}/notaries.json`)).default,
      },
    },
  };
}
