import Head from "next/head";
import { useTranslations } from "next-intl";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";
import { ApplicationEdit } from "@/components/applications/ApplicationEdit";
import { IApplication } from "@/models/applications/applications";

export default function EditApplication() {
  const url = "/api/applications/application?id=";
  const { query } = useRouter();
  const t = useTranslations();
  const { data } = useFetch(url + query.id, "POST");

  return (
    <>
      <Head>
        <title>{t("Applications")}</title>
      </Head>

      <Container>{data?.data?.[0] != null && <ApplicationEdit data={data.data[0] as IApplication} />}</Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/applications.json`)).default,
      },
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
