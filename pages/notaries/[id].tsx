import { useState } from "react";
import { GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { Container, Box, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

import NotariesInfoContent from "@/components/notaries/NotariesInfoContent";
import { IMarker } from "@/components/ui/LeafletMap";
import { ApiNotaryResponse } from "@/models/notaries";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

interface NotariesDetailPageProps {}

const NotariesDetailPage: React.FC<NotariesDetailPageProps> = (props) => {
  const t = useTranslations();

  const router = useRouter();

  const [markers, setMarkers] = useState<IMarker[]>();

  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  const { data, loading } = useFetch<ApiNotaryResponse>("/api/notaries/" + router.query.id, "GET");

  useEffectOnce(() => {
    if (Array.isArray(data?.data)) {
      setMarkers(
        data?.data.map((item) => ({
          coordinates: {
            lat: item.latitude,
            lng: item.longitude,
          },
          popup: (
            <>
              <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
                {item?.partner?.fullName}
              </Typography>
              <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={500}>
                {item?.address?.fullName}
              </Typography>
            </>
          ),
        }))
      );
    }
  }, [data]);

  const markerCenter: [number, number] =
    data?.data && data.data[0]
      ? [parseFloat(data.data[0]?.latitude as string), parseFloat(data.data[0]?.longitude as string)]
      : [42.8777895, 74.6066926];

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
          {!loading && data ? (
            <LeafletMap
              zoom={12}
              markers={markers}
              center={markerCenter}
              style={{
                height: "600px",
              }}
            />
          ) : (
            <CircularProgress />
          )}
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
