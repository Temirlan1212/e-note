import { Box, Container, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Image from "next/image";

import NotFoundImage from "../../public/images/NotFoundImage.svg";

type SearchForHeirsProps = {};

const SearchForHeirs = (props: SearchForHeirsProps) => {
  const t = useTranslations();
  return (
    <>
      <Head>
        <title>{t("Search for heirs")}</title>
      </Head>

      <Container sx={{ minHeight: "100vh", paddingTop: "80px" }}>
        <h1>{t("Search for heirs")}</h1>
        <Box
          sx={{
            margin: "50px auto 0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "12px",
          }}
        >
          <Typography sx={{ color: "#9A9A9A", fontSize: "24px", fontWeight: 600 }}>Пока ничего не найдено</Typography>
          <NotFoundImage />
        </Box>
      </Container>
    </>
  );
};

export default SearchForHeirs;

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`locales/${context.locale}/common.json`)).default,
    },
  };
}
