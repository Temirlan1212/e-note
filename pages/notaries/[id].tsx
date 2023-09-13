import { GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { Container, Box } from "@mui/material";
import { useRouter } from "next/router";

import NotariesInfoContent from "@/components/notaries/NotariesInfoContent";

interface NotariesDetailPageProps {}

const center: [number, number] = [42.882004, 74.582748];

const NotariesDetailPage: React.FC<NotariesDetailPageProps> = (props) => {
  const t = useTranslations();

  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  return (
    <>
      <Head>
        <title>{t("Notaries")}</title>
      </Head>

      <Container>
        <Box
          component="section"
          display="flex"
          flexDirection="column"
          sx={{
            gap: "40px",
            py: {
              xs: 5,
              md: 10,
            },
          }}
          marginBottom="40px"
        >
          <NotariesInfoContent />
          <LeafletMap
            center={center}
            zoom={12}
            style={{
              height: "600px",
            }}
          />
        </Box>
      </Container>
    </>
  );
};

export default NotariesDetailPage;

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

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
