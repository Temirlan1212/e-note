import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import ApplicationsGridTable from "@/components/applications/ApplicationsGridTable";

export default function Applications() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Applications")}</title>
      </Head>

      <Container>
        <ApplicationsGridTable />
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
