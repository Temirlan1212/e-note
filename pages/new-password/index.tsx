import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import NewPasswordForm from "@/components/new-password/NewPasswordForm";

export default function NewPasswordPage() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Reset Password")}</title>
      </Head>

      <Container>
        <NewPasswordForm />
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
        ...(await import(`locales/${context.locale}/validator.json`)).default,
      },
    },
  };
}
