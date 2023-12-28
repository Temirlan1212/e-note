import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { useState } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IMarker } from "@/components/ui/LeafletMap";
import NotaryRegistry from "@/components/notary-registry/NotaryRegistry";

export default function Notaries() {
  const t = useTranslations();

  const [markers, setMarkers] = useState<IMarker[]>();

  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  const { data: companies, loading: companiesLoading } = useFetch<FetchResponseBody | null | undefined>(
    "/api/companies",
    "POST"
  );

  useEffectOnce(() => {
    if (Array.isArray(companies?.data)) {
      setMarkers(
        companies?.data.map((item) => ({
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
  }, [companies]);

  return (
    <>
      <Head>
        <title>{t("Notaries")}</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <NotaryRegistry />
        <Box paddingBottom="80px" display="flex" flexDirection="column" gap="50px">
          <Typography variant="h4" color="success.main">
            {t("Search for a notary on the map")}
          </Typography>
          {!companiesLoading ? (
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
