import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import CustomButton from "@/components/ui/Button";
import { SearchOutlined } from "@mui/icons-material";

export default function About() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("About us")}</title>
      </Head>

      <Container sx={{ minHeight: "100vh" }}>
        <h1>{t("About us")}</h1>
        <CustomButton startIcon={<SearchOutlined />}>Найти</CustomButton>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`locales/${context.locale}/common.json`)).default,
    },
  };
}
