import { GetStaticPaths, GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { Container, Box } from "@mui/material";
import { useRouter } from "next/router";

import NotariesInfoContent from "@/components/notaries/NotariesInfoContent";

interface NotariesDetailPageProps {}

const center: [number, number] = [42.882004, 74.582748];

const NotariesDetailPage: React.FC<NotariesDetailPageProps> = (props) => {
  const router = useRouter();
  const { id } = router.query;

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
          <NotariesMap center={center} zoom={12} />
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
