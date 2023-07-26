import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import ForeignInstitutionsContent from "@/components/foreign-institutions/ForeignInstitutionsContent";

interface IForeignInstitutionsProps {}

export default function ForeignInstitutions() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("ForeignInstitutions")}</title>
      </Head>

      <Container
        maxWidth="xl"
        sx={{
          py: "40px",
        }}
      >
        <ForeignInstitutionsContent />
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
