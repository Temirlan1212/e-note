import Head from "next/head";
import { useState } from "react";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { GetStaticPropsContext } from "next";
import ApplicationList from "@/components/applications/ApplicationList";
import { IUserData } from "@/models/user";
import useEffectOnce from "@/hooks/useEffectOnce";

export default function Applications() {
  const [user, setUser] = useState<IUserData | null>();

  const t = useTranslations();

  const userData: IUserData | null = useProfileStore((state) => state.getUserData());

  useEffectOnce(() => {
    setUser(userData);
  }, [userData]);

  return (
    <>
      <Head>
        <title>{user?.group.id === 4 ? t("Notarial actions") : t("Applications")}</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <ApplicationList />
      </Container>
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
