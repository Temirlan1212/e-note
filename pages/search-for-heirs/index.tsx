import { Container, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

import SearchForm from "@/components/search-for-heirs/HeirSearchForm";
import HeirNotFoundData from "@/components/search-for-heirs/HeirNotFoundData";
import HeirFoundedData from "@/components/search-for-heirs/HeirFoundedData";

type ISearchForHeirsProps = {};

const SearchForHeirs = (props: ISearchForHeirsProps) => {
  const t = useTranslations();

  const data = [2];

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
        {data.length ? <HeirFoundedData /> : <HeirNotFoundData />}
      </Container>
    </>
  );
};

export default SearchForHeirs;

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/search-for-heirs.json`)).default,
      },
    },
  };
}
