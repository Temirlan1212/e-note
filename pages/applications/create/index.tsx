import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { Box, Container, Typography } from "@mui/material";
import ApplicationForm from "@/components/applications/form/ApplicationForm";
import Button from "@/components/ui/Button";
import CloseIcon from "@mui/icons-material/Close";

export default function CreateApplication() {
  const router = useRouter();

  const t = useTranslations();

  const handleCancelClick = () => {
    router.push("/applications");
  };

  return (
    <>
      <Head>
        <title>{t("Create notarial action")}</title>
      </Head>

      <Container maxWidth="xl">
        <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
          <Typography variant="h4" color="success.main">
            {t("Create notarial action")}
          </Typography>
          <Box>
            <Button buttonType="secondary" startIcon={<CloseIcon />} onClick={handleCancelClick}>
              {t("Cancel")}
            </Button>
          </Box>
        </Box>
        <ApplicationForm />
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
