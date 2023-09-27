import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import NotariesContent from "@/components/notaries/NotariesContent";
import useFetch from "@/hooks/useFetch";

export default function Notaries() {
  const t = useTranslations();

  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <p>Loading...</p>, ssr: false }
  );

  const { data: notaryData } = useFetch("/api/notaries", "POST");

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
          <LeafletMap
            zoom={12}
            markerData={notaryData?.data}
            slots={markerPopup}
            style={{
              height: "600px",
            }}
          />
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
