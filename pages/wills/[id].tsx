import Head from "next/head";
import { CircularProgress, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import WillInfoContent from "@/components/wills/will/WillInfoContent";
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";

export default function WillDetailPage() {
  const t = useTranslations();

  const router = useRouter();

  const { id } = router.query;

  const {
    data: willInfo,
    loading: loadingWillInfo,
    update: getWillInfo,
  } = useFetch(id != null ? "/api/wills/" + id : "", "POST");

  return (
    <>
      <Head>
        <title>{t("Register of wills")}</title>
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
        {loadingWillInfo ? <CircularProgress /> : <WillInfoContent willInfo={willInfo?.data?.[0]} />}
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
