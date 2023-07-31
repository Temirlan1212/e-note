import Head from "next/head";
import { useTranslations } from "next-intl";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { Container } from "@mui/material";
import ApplicationStatusInfoContent from "@/components/applications/status/ApplicationStatusInfoContent";

export default function ApplicationsStatusInformation() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("InformationAboutStatusApplication")}</title>
      </Head>

      <Container maxWidth="xl">
        <ApplicationStatusInfoContent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/validator.json`)).default,
        ...(await import(`locales/${context.locale}/applications.json`)).default,
      },
    },
  };
}

export async function getStaticPaths(context: GetStaticPathsContext) {
  return {
    paths: [],
    fallback: "blocking",
  };
}
