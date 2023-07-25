import { Container, useMediaQuery, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "../components/ui/Button";
import Box from "@mui/material/Box";
import Link from "@/components/ui/Link";

export default function Error404() {
  const t = useTranslations();

  return (
    <Container>
      <Grid margin={{ md: "50px 0 86px", xs: "40px 0 73px" }} justifyContent="center" alignItems="center" spacing={1}>
        <Grid xs={12}>
          <Typography textAlign="center">
            <Box
              component="img"
              sx={{
                height: { xs: "155.519px", sm: "206.999px", md: "323px" },
                width: { xs: "240px", sm: "320px", md: "500px" },
              }}
              alt="Not found"
              src="/images/not-found.svg"
            />
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography align="center" fontSize={{ md: "86px", xs: "64px" }} fontWeight={600}>
            404
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography align="center" fontSize={{ md: "36px", xs: "24px" }} fontWeight={600}>
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
            <Link href="/">
              <Button
                variant="contained"
                color="success"
                sx={{ padding: "14px 65px 14px 65px", marginTop: "30px", width: "unset" }}
              >
                {t("Go back to the main page")}
              </Button>
            </Link>
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
