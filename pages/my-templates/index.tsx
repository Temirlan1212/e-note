import Head from "next/head";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import MyTemplateListComponent from "@/components/my-template-list/my-template-list/MyTemplateList";
import NotaryMyTemplateListComponent from "@/components/my-template-list/notary-my-temlate-list/NotaryMyTemplateList";
import { useProfileStore } from "@/stores/profile";
import { useState } from "react";
import { IUserData } from "@/models/profile/user";
import useEffectOnce from "@/hooks/useEffectOnce";

export default function MyTemplateList() {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const t = useTranslations();
  const profile = useProfileStore.getState();

  useEffectOnce(async () => {
    setUserData(profile.getUserData());
  }, [profile]);

  return (
    <>
      <Head>
        <title>{t("Template list")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignSelf: "center",
          padding: { xs: "30px 20px 33px 20px", sm: "30px 20px 49px 20px", md: "60px 60px 46px 60px" },
          maxWidth: { xs: "unset", sm: "unset", md: "unset", lg: "unset" },
        }}
      >
        {userData?.group?.id === 4 ? <NotaryMyTemplateListComponent /> : <MyTemplateListComponent />}
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/template-list.json`)).default,
      },
    },
  };
}
