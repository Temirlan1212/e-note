import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import ArchiveApplicationList from "@/components/applications-archive/ArchiveApplicationList";

export default function ArchiveApplications() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Archive of notarial actions")}</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <ArchiveApplicationList />
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
