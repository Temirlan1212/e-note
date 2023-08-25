import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { Box, Container, Typography } from "@mui/material";
import ApplicationForm from "@/components/applications/form/ApplicationForm";
import Button from "@/components/ui/Button";
import CloseIcon from "@mui/icons-material/Close";
import { IUserData } from "@/models/user";
import useEffectOnce from "@/hooks/useEffectOnce";

export default function CreateApplication() {
  const [user, setUser] = useState<IUserData | null>();

  const router = useRouter();

  const t = useTranslations();

  const userData: IUserData | null = useProfileStore((state) => state.getUserData());

  useEffectOnce(() => {
    setUser(userData);
  }, [userData]);

  const handleCancelClick = () => {
    router.push("/applications");
  };

  return (
    <>
      <Head>
        <title>{user?.group.id === 4 ? t("Create notarial action") : t("Create application")}</title>
      </Head>

      <Container maxWidth="xl">
        <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
          <Typography variant="h4" color="success.main">
            {user?.group.id === 4 ? t("Create notarial action") : t("Create application")}
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
