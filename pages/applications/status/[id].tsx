import Head from "next/head";
import { useTranslations } from "next-intl";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { Container } from "@mui/material";
import ApplicationStatusInfoContent from "@/components/applications/status/ApplicationStatusInfoContent";
import { useRouter } from "next/router";

export default function ApplicationsStatusInformation() {
  const t = useTranslations();

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{t("InformationAboutStatusApplication")}</title>
      </Head>

      <Container maxWidth="xl">
        <ApplicationStatusInfoContent id={isNaN(parseInt(id as string)) ? undefined : parseInt(id as string)} />
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
