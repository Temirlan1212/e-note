import Head from "next/head";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import ForeignInstitutionsOfficialsContent from "@/components/foreign-institutions-officials/ForeignInstitutionsContent";

export default function ForeignInstitutionsOfficials() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("ForeignInstitutions")}</title>
      </Head>

      <Box sx={{ py: "30px", px: "30px" }}>
        <ForeignInstitutionsOfficialsContent />
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
