import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import OMSUOfficialsContent from "@/components/omsu/OMSUOfficialsContent";

export default function OMSUOfficials() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("OMSUOfficials")}</title>
      </Head>

      <Container
        maxWidth="xl"
        sx={{
          py: "40px",
        }}
      >
        <OMSUOfficialsContent />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
      },
    },
  };
}
