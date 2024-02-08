import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { Container } from "@mui/material";
import HeirInfoContent from "@/components/inheritance-cases/heir/HeirInfoContent";

export default function HeirDetailPage() {
  const t = useTranslations();

  const router = useRouter();

  const { parentId, id } = router.query;

  return (
    <>
      <Head>
        <title>{t("Информация о наследнике")}</title>
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
        <HeirInfoContent heirId={id} inheritanceCaseId={parentId} />
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
