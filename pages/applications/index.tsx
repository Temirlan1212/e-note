import Head from "next/head";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import ApplicationList from "@/components/applications/ApplicationList";

export default function Applications() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Notarial actions")}</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <ApplicationList />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/applications.json`)).default,
      },
    },
  };
}
