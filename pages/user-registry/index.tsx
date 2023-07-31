import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import UserRegistryContent from "@/components/user-registry/UserRegistryContent";

export default function UserRegistry() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("User Registry")}</title>
      </Head>

      <Container
        component="section"
        maxWidth="xl"
        sx={{
          pt: "40px",
          pb: "60px",
        }}
      >
        <UserRegistryContent />
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
