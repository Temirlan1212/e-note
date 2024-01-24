import { Box, CircularProgress, Container, List, ListItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import LinkIcon from "@/public/icons/link.svg";
import Link from "@/components/ui/Link";
import Image from "next/image";
import Head from "next/head";
import { GetStaticPropsContext } from "next";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import HeirNotFoundData from "@/components/search-for-heirs/components/HeirNotFoundData";

interface IRegulatoryActs {
  title: string;
  url: string;
  id: number;
  "$t:title": string;
}

const RegulatoryActs: React.FC = () => {
  const t = useTranslations();
  const { locale } = useRouter();

  const { data: regulatoryActsData, loading: regulatoryActsLoading } = useFetch<FetchResponseBody | null>(
    "/api/regulatory-acts",
    "POST"
  );

  return (
    <>
      <Head>
        <title>{t("Regulatory acts")}</title>
        <meta name="keywords" content={t("Regulatory acts")} />
        <meta name="description" content={t("Regulatory acts")} />
      </Head>

      <Container>
        <Box
          component="section"
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "end" }}
          flexDirection={{ xs: "column-reverse", md: "row" }}
          padding="50px 0"
          gap={{ xs: "40px", sm: "80px", md: "100px" }}
        >
          <Box display="flex" flexDirection="column" gap="50px">
            <Typography variant="h1" fontWeight={600}>
              {t("Regulatory framework")}
            </Typography>
            {regulatoryActsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            ) : (
              regulatoryActsData && (
                <List sx={{ display: "flex", flexDirection: "column", gap: "35px" }}>
                  {regulatoryActsData?.data?.map(({ title, url, id, ["$t:title"]: tTitle }: IRegulatoryActs) => (
                    <ListItem disablePadding key={id}>
                      <Link
                        href={url}
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
                        <Typography color="inherit">{locale === "en" ? title : tTitle}</Typography>
                        <Box>
                          <LinkIcon />
                        </Box>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              )
            )}
          </Box>
          {regulatoryActsData && (
            <Box width={{ xs: 280, sm: 400, md: 500 }}>
              <Image src="/images/legal-framework.png" alt="E-notariat" width={500} height={398} layout="responsive" />
            </Box>
          )}
        </Box>
        {regulatoryActsLoading
          ? null
          : !regulatoryActsData && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <HeirNotFoundData />
              </Box>
            )}
      </Container>
    </>
  );
};

export default RegulatoryActs;

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/regulatory-acts.json`)).default,
      },
    },
  };
}
