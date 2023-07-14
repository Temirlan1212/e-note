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
        <Box py={5}>
          <Typography variant="h1" fontWeight={600} my={6} textAlign={"center"}>
            {t("Login to your personal account")}
          </Typography>
          <LoginAccordion />
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
        ...(await import(`locales/${context.locale}/login.json`)).default,
      },
    },
  };
}
