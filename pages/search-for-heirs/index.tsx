import FoundedData from "@/components/search-for-heirs/FoundedData";
import NotFoundData from "@/components/search-for-heirs/NotFoundData";
import Select from "@/components/ui/Select";
import { Box, Container, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

type SearchForHeirsProps = {};

const SearchForHeirs = (props: SearchForHeirsProps) => {
  const t = useTranslations();

  const data = [];

  const sdata = [
    { value: 10, label: "В алфавитном порядке" },
    { value: 20, label: "Option 2" },
    { value: 30, label: "Option 3" },
  ];
  return (
    <>
      <Head>
        <title>{t("Search for heirs")}</title>
      </Head>

      <Container sx={{ minHeight: "100vh", paddingTop: "80px" }}>
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
        <FoundedData />
        <Select data={sdata} selectType={"primary"} />
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
