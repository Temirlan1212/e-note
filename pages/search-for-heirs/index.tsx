import FoundedData from "@/components/search-for-heirs/FoundedData";
import NotFoundData from "@/components/search-for-heirs/NotFoundData";
// import NotFoundData from "@/components/search-for-heirs/NotFoundData";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Container, FormControl, InputLabel, Typography, useMediaQuery } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

type SearchForHeirsProps = {};

const SearchForHeirs = (props: SearchForHeirsProps) => {
  const t = useTranslations();

  const matches = useMediaQuery("(min-width:900px)");

  const data = ["asd"];

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
        <Box sx={{ marginTop: "50px" }}>
          <form
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: matches ? "row" : "column",
              gap: matches ? "40px" : "30px",
            }}
          >
            <FormControl sx={{ width: "100%" }}>
              <InputLabel
                sx={{ color: "#24334B", fontSize: "18px", top: "-16px", left: "-14px", fontWeight: "500" }}
                shrink
              >
                ФИО наследодателя (обязателен)
              </InputLabel>
              <Input placeholder="Введите ФИО" helperText="не введено ФИО наследодателя" />
            </FormControl>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel
                sx={{ color: "#24334B", fontSize: "18px", top: "-16px", left: "-14px", fontWeight: "500" }}
                shrink
              >
                ИНН наследодателя
              </InputLabel>
              <Input placeholder="Введите ИНН" />
            </FormControl>
            <Button startIcon={<SearchOutlined />} sx={{ width: "100%", height: "56px" }}>
              Найти
            </Button>
          </form>
        </Box>
        {data.length < 0 ? <FoundedData /> : <NotFoundData />}
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
