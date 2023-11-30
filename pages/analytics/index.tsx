import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import AnalyticsContent from "@/components/analytics/Analytics";

export default function Analytics() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Analytics")}</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: "30px", height: "100%" }}>
        <AnalyticsContent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/analytics.json`)).default,
      },
    },
  };
}
