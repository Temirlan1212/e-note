import { useEffect } from "react";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Container } from "@mui/material";
import DocumentInfoContent from "@/components/check-document/document/DocumentInfoContent";
import useFetch from "@/hooks/useFetch";

export default function UniqueQrCode() {
  const t = useTranslations();

  const router = useRouter();
  const { id } = router.query;

  const { data, update } = useFetch("", "POST");

  useEffect(() => {
    update(`/api/check-document`, {
      criteria: [
        {
          fieldName: "uniqueQrCode",
          operator: "=",
          value: id,
        },
      ],
    });
  }, [id]);

  return (
    <>
      <Head>
        <title>{t("Check document")}</title>
      </Head>

      <Container maxWidth="xl">
        <DocumentInfoContent id={data?.data?.[0]?.id} />
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/validator.json`)).default,
        ...(await import(`locales/${context.locale}/check-document.json`)).default,
      },
    },
  };
}

export async function getStaticPaths(context: GetStaticPathsContext) {
  return {
    paths: [],
    fallback: "blocking",
  };
}
