import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { Box, Container, Typography } from "@mui/material";
import ApplicationForm from "@/components/applications/form/ApplicationForm";
import Button from "@/components/ui/Button";
import CloseIcon from "@mui/icons-material/Close";
import { IProfileState, IUserData } from "@/models/profile/user";

export default function EditApplication() {
  const router = useRouter();
  const t = useTranslations();

  const { id } = router.query;

  const userData: IUserData | null = useProfileStore((state: IProfileState) => state.getUserData());

  const handleCancelClick = () => {
    router.push("/applications");
  };

  return (
    <>
      <Head>
        <title>{userData?.group.id === 4 ? t("Edit notarial actions") : t("Edit application")}</title>
      </Head>

      <Container maxWidth="xl">
        <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
          <Typography variant="h4" color="success.main">
            {userData?.group.id === 4 ? t("Edit notarial action") : t("Edit application")}
          </Typography>
          <Box>
            <Button buttonType="secondary" startIcon={<CloseIcon />} onClick={handleCancelClick}>
              {t("Cancel")}
            </Button>
          </Box>
        </Box>
        <ApplicationForm id={parseInt(typeof id === "string" ? id : "")} />
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

export function getStaticPaths(context: GetStaticPathsContext) {
  return {
    paths: [],
    fallback: "blocking",
  };
}
