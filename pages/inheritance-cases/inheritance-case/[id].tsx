import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import InheritanceCasesInfoContent from "@/components/inheritance-cases/inheritance-case/InheritanceCaseInfoContent";
import { useRouter } from "next/router";

export default function InheritanceCases() {
  const t = useTranslations();

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{t("Register of inheritance cases")}</title>
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
        <InheritanceCasesInfoContent id={id} />
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
