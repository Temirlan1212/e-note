import { Container, useMediaQuery, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "../components/ui/Button";
import Image from "next/image";

export default function Error404() {
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallerScreen = useMediaQuery("(max-width: 280px)");

  return (
    <Container>
      <Grid margin={!isMobile ? "50px 0 86px" : "40px 0 73px"} justifyContent="center" alignItems="center" spacing={1}>
        <Grid xs={12}>
          <Typography textAlign="center">
            <Image
              src="/icons/notFound.svg"
              alt="Not found"
              width={isSmallerScreen ? 240 : isMobile ? 320 : 500}
              height={isSmallerScreen ? 155.519 : isMobile ? 206.999 : 323}
            />
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography align="center" fontSize={!isMobile ? "86px" : "64px"} fontWeight={600}>
            404
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography align="center" fontSize={!isMobile ? "36px" : "24px"} fontWeight={600}>
            {t("The page is not available")}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography align="center" color="textSecondary" fontWeight={500}>
            {t("Unfortunately, we cannot find the requested page")}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography display="flex" justifyContent="center">
            <Button
              href="/"
              variant="contained"
              color="success"
              sx={{ padding: "14px 65px 14px 65px", marginTop: "30px", width: "unset" }}
            >
              {t("Go back to the main page")}
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/404.json`)).default,
      },
    },
  };
}
