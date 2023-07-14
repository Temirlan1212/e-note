import Head from "next/head";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import Hint from "@/components/ui/Hint";

export default function ResetPassword() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("Reset Password")}</title>
      </Head>

      <Container>
        <Box py={5}>
          <Typography variant="h1" fontWeight={600} my={6} textAlign={"center"}>
            {t("Reset Password")}
          </Typography>
          <Box
            sx={{
              padding: "30px 20px",
              maxWidth: "520px",
              margin: "0 auto",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 5px 20px 0px #E9E9E9",
            }}
          >
            <Hint type="hint">{t("To change your password, enter your E-mail, A reset link will be sent to it,")}</Hint>
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
        ...(await import(`locales/${context.locale}/login.json`)).default,
      },
    },
  };
}
