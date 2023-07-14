import { Box, Container, List, ListItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import LinkIcon from "@/public/icons/link.svg";
import Link from "@/components/ui/Link";
import Image from "next/image";
import Head from "next/head";
import { GetStaticPropsContext } from "next";

const RegulatoryActs: React.FC = () => {
  const t = useTranslations();

  const legalFrameworkData = [
    { title: "Code of the Kyrgyz Republic on non-tax income", link: "http://cbd.minjust.gov.kg/act/view/ru-ru/111820" },
    { title: "The Law of the Kyrgyz Republic 'On Notary", link: "http://cbd.minjust.gov.kg/act/view/ru-ru/78" },
    { title: "Civil Code of the Kyrgyz Republic", link: "http://cbd.minjust.gov.kg/act/view/ru-ru/111521?cl=ru-ru" },
    { title: "Labor Code of the Kyrgyz Republic", link: "http://cbd.minjust.gov.kg/act/view/ru-ru/1505" },
    { title: "Land Code of the Kyrgyz Republic", link: "http://cbd.minjust.gov.kg/act/view/ru-ru/8" },
    {
      title: "Resolution of the Government of the Kyrgyz Republic 'On Issues of notarial activity'",
      link: "http://cbd.minjust.gov.kg/act/view/ru-ru/95037",
    },
  ];

  return (
    <>
      <Head>
        <title>{t("Regulatory acts")}</title>
        <meta name="keywords" content={"Regulatory acts"} />
        <meta name="description" content={"Regulatory acts"} />
      </Head>

      <Container>
        <Box
          component="section"
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "end" }}
          flexDirection={{ xs: "column-reverse", md: "row" }}
          padding="50px 0"
          gap="100px"
        >
          <Box display="flex" flexDirection="column" gap="50px">
            <Typography variant="h1" fontWeight={600}>
              {t("Regulatory framework")}
            </Typography>

            <List sx={{ display: "flex", flexDirection: "column", gap: "35px" }}>
              {legalFrameworkData.map(({ title, link }, index) => (
                <ListItem disablePadding key={index}>
                  <Link
                    href={link}
                    display="flex"
                    maxWidth={602}
                    sx={{
                      "&:hover": {
                        color: "success.main",
                      },
                    }}
                    justifyContent="space-between"
                    width="100%"
                    target="_blank"
                    underline="hover"
                    gap="30px"
                  >
                    <Typography color="inherit">{t(title)}</Typography>
                    <Box>
                      <LinkIcon />
                    </Box>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Image src="/images/legal-framework.png" alt="E-notariat" width={500} height={398} layout="responsive" />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default RegulatoryActs;

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`locales/${context.locale}/common.json`)).default,
    },
  };
}
