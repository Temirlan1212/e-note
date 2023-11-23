import Head from "next/head";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import ProfileContent from "@/components/profile/ProfileContent";

export default function Profile() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Profile")}</title>
      </Head>

      <Container
        maxWidth="xl"
        sx={{
          pt: "20px",
          pb: "50px",
        }}
      >
        <ProfileContent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/profile.json`)).default,
        ...(await import(`locales/${context.locale}/validator.json`)).default,
      },
    },
  };
}
