import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { Box, Container, Typography } from "@mui/material";
import ApplicationForm from "@/components/applications/form/ApplicationForm";
import Button from "@/components/ui/Button";
import CloseIcon from "@mui/icons-material/Close";
import ApplicationStatusInfoContent from "@/components/applications/status/ApplicationStatusInfoContent";

export default function Applications() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("InformationAboutStatusApplication")}</title>
      </Head>

      <Container
        maxWidth="xl"
        sx={{
          p: {
            xs: "20px",
            md: "40px",
          },
        }}
      >
        <ApplicationStatusInfoContent />
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
        ...(await import(`locales/${context.locale}/applications.json`)).default,
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
