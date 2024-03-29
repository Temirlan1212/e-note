import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import BlackListComponent from "@/components/black-list/BlackList";

export default function BlackList() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Black list")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          py: "30px",
          maxWidth: { xs: "unset", sm: "unset", md: "unset", lg: "unset" },
        }}
      >
        <BlackListComponent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/black-list.json`)).default,
      },
    },
  };
}
