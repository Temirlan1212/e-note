import Head from "next/head";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { GetStaticPropsContext } from "next";
import ApplicationList from "@/components/applications/ApplicationList";

export default function Applications() {
  const t = useTranslations();

  const userData = useProfileStore((state) => state.userData);

  return (
    <>
      <Head>
        <title>{userData?.group.id === 4 ? t("Notarial actions") : t("Applications")}</title>
      </Head>

      <Container maxWidth="xl">
        <Box marginTop="30px">
          <ApplicationList />
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
        ...(await import(`locales/${context.locale}/applications.json`)).default,
      },
    },
  };
}
