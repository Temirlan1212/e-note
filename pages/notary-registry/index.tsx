import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import NotaryRegistry from "@/components/notary-registry/NotaryRegistry";

const center: [number, number] = [42.882004, 74.582748];

export default function Notaries() {
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

      <Container maxWidth="xl" sx={{ py: "30px" }}>
        <NotaryRegistry />
        <Box paddingBottom="80px" display="flex" flexDirection="column" gap="20px">
          <Typography variant="h4">{t("Search for a notary on the map")}</Typography>
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