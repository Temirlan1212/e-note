import Head from "next/head";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import ServicesSection from "@/components/home-page/ServicesSection";
import HeroSection from "@/components/home-page/HeroSection";
import MoreSection from "@/components/home-page/MoreSection";

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("E-notariat")}</title>
        <meta name="keywords" content="e-notariat, E-notariat, E-Notariat" />
        <meta name="description" content="E-notariat" />
      </Head>

      <Container>
        <Box py="80px" display="flex" flexDirection="column" gap="130px">
          <HeroSection />
          <MoreSection />
          <ServicesSection />
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/home.json`)).default,
      },
    },
  };
}
