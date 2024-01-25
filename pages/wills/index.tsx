import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { FetchListParamsContextProvider } from "@/contexts/fetch-list-params";
import WillsList from "@/components/wills/wills-list/WillList";

export default function WillsRegister() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Register of wills")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          py: "30px",
          gap: "30px",
          maxWidth: { xs: "unset", sm: "unset", md: "unset", lg: "unset" },
        }}
      >
        <FetchListParamsContextProvider>
          <WillsList />
        </FetchListParamsContextProvider>
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
        ...(await import(`locales/${context.locale}/404.json`)).default,
      },
    },
  };
}
