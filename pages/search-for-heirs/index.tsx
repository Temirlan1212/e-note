import { Container, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

import FoundedData from "@/components/search-for-heirs/FoundedData";
import NotFoundData from "@/components/search-for-heirs/NotFoundData";
import SearchForm from "@/components/search-for-heirs/SearchForm";

type SearchForHeirsProps = {};

const SearchForHeirs = (props: SearchForHeirsProps) => {
  const t = useTranslations();

  const data = ["asdas"];

  return (
    <>
      <Head>
        <title>{t("Search for heirs")}</title>
      </Head>

      <Container sx={{ padding: "80px 15px" }}>
        <Typography
          sx={{
            fontSize: {
              md: 36,
              sm: 24,
            },
            fontWeight: 600,
            color: "#24334B",
          }}
        >
          {t("Search for heirs")}
        </Typography>
        <SearchForm />
        {data.length ? <FoundedData /> : <NotFoundData />}
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
