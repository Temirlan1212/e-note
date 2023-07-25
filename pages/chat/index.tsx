import Head from "next/head";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import { Container } from "@mui/material";

import ChatContent from "@/components/chat/ChatContent";

export default function Chat() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Correspondence")}</title>
      </Head>

      <Container
        maxWidth="xl"
        sx={{
          py: "50px",
        }}
      >
        <ChatContent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/chat.json`)).default,
      },
    },
  };
}
