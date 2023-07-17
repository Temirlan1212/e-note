import Head from "next/head";
import dynamic from "next/dynamic";

import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { Marker } from "react-leaflet";

import NotariesFiltration from "@/components/notaries/NotariesFiltration";
import NotariesList from "@/components/notaries/NotariesList";

const center: [number, number] = [42.882004, 74.582748];

export default function About() {
  const t = useTranslations();

  const NotariesMap = dynamic(
    () => {
      return import("@/components/notaries/NotariesMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  return (
    <>
      <Head>
        <title>{t("Notaries")}</title>
      </Head>

      <Container>
        <Box component="section" py={10} display="flex" flexDirection="column" gap="60px" marginBottom="40px">
          <Typography
            component="h1"
            sx={{
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            Реестр нотариусов Кыргызской Республики
          </Typography>

          <NotariesFiltration />

          <NotariesList />
        </Box>

        <Box paddingBottom="80px" display="flex" flexDirection="column" gap="50px">
          <Typography
            component="h1"
            sx={{
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            Поиск нотариуса на карте
          </Typography>
          <NotariesMap center={center} zoom={12} />
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
        ...(await import(`locales/${context.locale}/notaries.json`)).default,
      },
    },
  };
}
