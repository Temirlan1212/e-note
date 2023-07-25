import Head from "next/head";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import FileList from "@/components/files/FileList";

export default function Files() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Files")}</title>
      </Head>

      <Container maxWidth="xl">
        <FileList />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/files.json`)).default,
      },
    },
  };
}
