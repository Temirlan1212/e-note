import { GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { Container, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

import NotariesInfoContent from "@/components/notaries/NotariesInfoContent";
import { ApiNotaryResponse } from "@/models/notaries";
import useFetch from "@/hooks/useFetch";

interface NotariesDetailPageProps {}

const NotariesDetailPage: React.FC<NotariesDetailPageProps> = (props) => {
  const t = useTranslations();

  const router = useRouter();

  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  const { data } = useFetch<ApiNotaryResponse>("/api/notaries/" + router.query.id, "POST");

  const markerPopup = (data: any) => {
    return (
      <>
        <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
          {data?.name}
        </Typography>
        <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={500}>
          {data?.address?.fullName}
        </Typography>
      </>
    );
  };

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
            zoom={12}
            markerData={data?.data[0]}
            slots={markerPopup}
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
