import Head from "next/head";
import { Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import UserCreateContent from "@/components/user-registry/create/UserCreateContent";

export default function UserRegistry() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Create user")}</title>
      </Head>

      <Container
        component="section"
        maxWidth="lg"
        sx={{
          pt: "30px",
          pb: "60px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Typography component="h1" fontSize="24px" fontWeight="500">
          {t("Create user")}
        </Typography>
        <UserCreateContent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/user-registry.json`)).default,
      },
    },
  };
}
