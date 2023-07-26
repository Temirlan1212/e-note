import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import InheritanceCases from "../../components/registries/InheritanceCases";

export default function inheritanceCases() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Register of inheritance cases")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: { xs: "30px 20px 31px 20px", sm: "30px 20px 57px 20px", md: "60px 60px 198px 60px" },
          maxWidth: { xs: "unset", sm: "unset", md: "unset", lg: "unset" },
        }}
      >
        <InheritanceCases />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/inheritance-cases.json`)).default,
      },
    },
  };
}
