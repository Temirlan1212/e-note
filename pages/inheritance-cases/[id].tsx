import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import InheritorInfoContent from "@/components/inheritance-cases/inheritance-case/InheritanceCaseInfoContent";
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";

export default function InheritorDetailPage() {
  const t = useTranslations();

  const router = useRouter();

  const { id } = router.query;

  const { data: inheritanceCaseData, update: getInheritanceCase } = useFetch(
    id != null ? "/api/inheritance-cases/" + id : "",
    "POST"
  );

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
        <InheritorInfoContent data={inheritanceCaseData?.data?.[0]} />
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

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
