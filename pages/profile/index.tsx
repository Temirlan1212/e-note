import Head from "next/head";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Profile")}</title>
      </Head>

      <Box p={3} minHeight={"100vh"}>
        {t("Profile")}
      </Box>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/profile.json`)).default,
      },
    },
  };
}
