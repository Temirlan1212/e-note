import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import Image from "next/image";

const styled_p = {
  textIndent: "25px",
  fontSize: "18px",
  color: "#24334B",
  margin: "20px 0 15px 0",
};

const span_style = {
  fontWeight: 600,
};

export default function About() {
  const t = useTranslations();

  const people = [
    { name: t("members are 1") },
    { name: t("members are 2") },
    { name: t("members are 3") },
    { name: t("members are 4") },
    { name: t("members are 5") },
    { name: t("members are 6") },
    { name: t("members are 7") },
    { name: t("members are 8") },
    { name: t("members are 9") },
  ];

  return (
    <>
      <Head>
        <title>{t("About us")}</title>
      </Head>

      <Container>
        <h1>{t("About us")}</h1>
        <Box>
          <Typography
            variant="h4"
            m="20px 0 10px 0"
            sx={{
              color: "#1BAA75",
            }}
          >
            {t("chamber of Kyrgyz republic")}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-1")}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-2")}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("main tasks")}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>1)</span> {t("task-1")}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>2)</span> {t("task-2")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>3)</span> {t("task-3")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>4)</span> {t("task-4")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>5)</span> {t("task-5")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>6)</span> {t("task-6")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>7)</span> {t("task-7")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>8)</span> {t("task-8")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>9)</span> {t("task-9")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>10)</span> {t("task-10")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>11)</span> {t("task-11")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            <span style={span_style}>12)</span> {t("task-12")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-3")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-4")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-5")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-6")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("members are")}
          </Typography>
          {people.map((i) => (
            <Typography key={i.name} sx={{ fontWeight: 500 }} style={styled_p} component="p">
              {i.name}
            </Typography>
          ))}
          <Typography style={styled_p} component="p">
            {t("paragraph-7")}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("paragraph-8")}
          </Typography>

          <Typography
            variant="h4"
            m="20px 0 10px 0"
            sx={{
              color: "#1BAA75",
            }}
          >
            {" "}
            {t("title-2")}{" "}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("commission-1")}
          </Typography>
          <Typography style={styled_p} component="p">
            {t("commission-2")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "35px",
              "& img": {
                display: {
                  md: "block",
                  xs: "none",
                },
              },
            }}
          >
            <div>
              <Typography
                variant="h4"
                m="20px 0 10px 0"
                sx={{
                  color: "#1BAA75",
                }}
              >
                {t("info contacts")}
              </Typography>
              <Typography sx={{ display: "flex" }} gap="10px" component="div">
                <Typography sx={{ fontWeight: 600 }}>{t("title adress")}</Typography>
                <Typography> {t("adress")}</Typography>
              </Typography>
              <Typography sx={{ display: "flex" }} gap="10px" component="div">
                <Typography sx={{ fontWeight: 600 }}>{t("title phone")}</Typography>
                <Typography component="a" href="tel:996312343527">
                  {" "}
                  {t("phone")}{" "}
                </Typography>
              </Typography>
              <Typography sx={{ display: "flex" }} gap="10px" component="div">
                <Typography sx={{ fontWeight: 600 }}>{t("title e-mail")} </Typography>
                <Typography> {t("e-mail")} </Typography>
              </Typography>
              <Typography sx={{ display: "flex" }} gap="10px" component="div">
                <Typography sx={{ fontWeight: 600 }}>{t("title schedule")}</Typography>
                <Typography> {t("schedule")} </Typography>
              </Typography>
            </div>
            <Image src="/images/contacts.png" width={350} height={250} alt="contact image" />
          </Box>
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
        ...(await import(`locales/${context.locale}/about-us.json`)).default,
      },
    },
  };
}
