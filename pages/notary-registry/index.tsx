import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import NotariesContent from "@/components/notaries/NotariesContent";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IMarker } from "@/components/ui/LeafletMap";

export default function Notaries() {
  const t = useTranslations();

  const [markers, setMarkers] = useState<IMarker[]>();

  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  const { data: notaryData, loading: notaryDataLoading } = useFetch("/api/notaries", "POST");

  useEffectOnce(() => {
    if (Array.isArray(notaryData?.data)) {
      setMarkers(
        notaryData?.data.map((item) => ({
          coordinates: {
            lat: item.latitude,
            lng: item.longitude,
          },
          popup: (
            <>
              <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={600}>
                {item?.["partner.fullName"]}
              </Typography>
              <Typography fontSize={{ xs: 9, sm: 10, md: 12, lg: 14 }} fontWeight={500}>
                {item?.["address.fullName"]}
              </Typography>
            </>
          ),
        }))
      );
    }
  }, [notaryData]);

  return (
    <>
      <Head>
        <title>{t("Notaries")}</title>
      </Head>

      <Container>
        <NotariesContent />
        <Box paddingBottom="80px" display="flex" flexDirection="column" gap="50px">
          <Typography
            component="h1"
            sx={{
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            {t("Search for a notary on the map")}
          </Typography>
          {!notaryDataLoading && notaryData ? (
            <LeafletMap
              zoom={12}
              markers={markers}
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
