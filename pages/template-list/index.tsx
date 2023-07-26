import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import TemplateList from "@/components/template-list/TemplateList";

export default function Profile() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Template list")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignSelf: "center",
          padding: { xs: "30px 20px 33px 20px", sm: "30px 20px 49px 20px", md: "60px 60px 46px 60px" },
          maxWidth: { xs: "unset", sm: "unset", md: "unset", lg: "unset" },
        }}
      >
        <TemplateList />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/template-list.json`)).default,
      },
    },
  };
}
