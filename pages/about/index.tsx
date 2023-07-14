import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

export default function About() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("About us")}</title>
      </Head>

      <Container>
        <h1>{t("About us")}</h1>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`locales/${context.locale}/common.json`)).default,
    },
  };
}
