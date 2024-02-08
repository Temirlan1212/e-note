import Head from "next/head";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import OMSUOfficialsContent from "@/components/omsu/OMSUOfficialsContent";
import { Box } from "@mui/material";

export default function OMSUOfficials() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("OMSUOfficials")}</title>
      </Head>

      <Box sx={{ py: "30px", px: "30px" }}>
        <OMSUOfficialsContent />
      </Box>
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
