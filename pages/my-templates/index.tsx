import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import MyTemplateListComponent from "@/components/my-template-list/MyTemplateList";

export default function MyTemplateList() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Template list")}</title>
      </Head>
      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <MyTemplateListComponent />
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
