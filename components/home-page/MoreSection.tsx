import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "@/components/ui/Link";
import Image from "next/image";

const MoreSection: React.FC = () => {
  const t = useTranslations();

  return (
    <Box
      component="section"
      bgcolor="success.main"
      display="flex"
      px={{ xs: "10px", lg: "50px" }}
      paddingTop={{ xs: "70px", md: "50px" }}
      paddingBottom="50px"
      position="relative"
      justifyContent={{ xs: "center", md: "flex-end" }}
      marginTop={{ xs: "100px", md: "0px" }}
      boxShadow="0 20px 35px #9ecdb8"
    >
      <Box
        width={{ xs: 207, md: 250, lg: 276 }}
        height={288}
        marginTop={{ xs: "-240px", md: "-110px" }}
        margin="50vh auto 0"
        right={{ xs: "0px", md: "auto" }}
        position="absolute"
        left={{ xs: "40px", lg: "90px" }}
      >
        <Image src="/images/more-section.png" alt="E-notariat" width={276} height={288} layout="responsive" />
      </Box>

      <Box maxWidth={{ xs: 540, lg: 635 }} display="flex" flexDirection="column" gap="25px">
        <Typography variant="h3" color="white" fontWeight={600}>
          {t("Find out how to get notary services quickly, conveniently and safely using the portal")}
        </Typography>

        <Link href="/" underline="always" color="#fff">
          {t("More")}
        </Link>
      </Box>
    </Box>
  );
};

export default MoreSection;
