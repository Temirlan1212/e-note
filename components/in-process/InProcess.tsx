import { Container, Box, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Link from "@/components/ui/Link";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";

export default function InProcess() {
  const t = useTranslations();

  return (
    <Box
      sx={{
        margin: { md: "50px 0 86px", xs: "40px 0 73px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <ManageHistoryIcon
        sx={{
          color: "success.main",
          height: { xs: "155.519px", sm: "206.999px", md: "323px" },
          width: { xs: "240px", sm: "320px", md: "500px" },
        }}
      />
      <Typography align="center" fontSize={{ md: "36px", xs: "24px" }} fontWeight={600}>
        {t("The page is under development")}
      </Typography>
      <Link href="/">
        <Button variant="contained" color="success" sx={{ padding: "14px 65px 14px 65px", marginTop: "15px" }}>
          {t("Go back to the main page")}
        </Button>
      </Link>
    </Box>
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
