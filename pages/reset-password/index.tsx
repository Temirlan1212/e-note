import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import ResetPassword from "@/components/reset-password";

export default function ResetPasswordPage() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Reset Password")}</title>
      </Head>

      <Container>
        <ResetPassword />
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
