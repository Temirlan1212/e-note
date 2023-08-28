import Head from "next/head";
import { Container } from "@mui/material";
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

      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <ForeignInstitutionsOfficialsContent />
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
