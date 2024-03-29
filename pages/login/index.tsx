import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import LoginAccordion from "@/components/login/LoginAccordion";

export default function Login() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Login")}</title>
      </Head>

      <Container>
        <LoginAccordion />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/login.json`)).default,
        ...(await import(`locales/${context.locale}/ecp-errors.json`)).default,
      },
    },
  };
}
