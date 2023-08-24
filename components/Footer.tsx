import { Box, Container, List, ListItem, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { WhatsApp, Instagram, Facebook } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

interface IFooterDataItem {
  title: string;
  link: string;
}

interface IFooterSection {
  title: string;
  items: IFooterDataItem[];
}

const footerData: Record<string, IFooterDataItem[]> = {
  Links: [
    { title: "About us", link: "/about" },
    { title: "Notaries", link: "/notaries" },
    { title: "Regulatory acts", link: "/regulatory-acts" },
    { title: "Questions and answers", link: "/qa" },
  ],
  Contacts: [
    { title: "Alisher uulu Alymbek", link: "/#" },
    { title: "Address: Bishkek, blvd Molodoy Guardii 32", link: "https://go.2gis.com/divf1" },
    { title: "Phone number: +996 (312) 34-35-27", link: "tel:+996312343527" },
    { title: "E-mail: not palata kr@gmail com", link: "mailto:not.palata.kr@gmail.com" },
    { title: "Working hours: Mon-Fri, 09:00-18:00", link: "/#" },
  ],
};

const footerIconsData = [
  { icon: WhatsApp, url: "https://whatsapp.com" },
  { icon: Facebook, url: "https://ru-ru.facebook.com" },
  { icon: Instagram, url: "https://www.instagram.com" },
];

const Footer: React.FC = () => {
  const t = useTranslations();

  return (
    <Box sx={{ bgcolor: "success.main", padding: { xs: "48px 0", md: "30px 0" } }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "20px", md: "60px" },
          }}
        >
          <Box>
            <Link href="/" sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image src="/images/logo.png" alt="E-notariat" width={48} height={48} />
              <Typography variant="h6" color="white" fontWeight={600} whiteSpace="nowrap">
                E-NOTARIAT
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: "30px", sm: "60px" } }}>
            {Object.entries(footerData).map(([title, items]) => (
              <FooterSection key={title} title={title} items={items} />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "flex-start" },
            gap: { xs: "22px", md: "32px" },
            marginTop: { xl: "45px", lg: "45px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              gap: { xs: "20px" },
            }}
          >
            <Typography color="white">{t("2023 E-Notariat All rights Reserved")}</Typography>
          </Box>

          <List sx={{ display: "flex", width: "fit-content", gap: "25.5px" }}>
            {footerIconsData.map(({ icon: Icon, url }) => (
              <Tooltip title={url} placement="top" key={url}>
                <ListItem disablePadding>
                  <Link href={url}>
                    <Icon sx={{ fill: "#fff" }} />
                  </Link>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

const FooterSection: React.FC<IFooterSection> = ({ title, items }) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <section>
      <Typography variant="h5" padding="0 0 20px 0" color="white">
        {t(title)}
      </Typography>

      <List>
        {items.map(({ title, link }, index) =>
          title ? (
            <ListItem sx={{ padding: "0 0 24px 0" }} key={index}>
              <Link href={link} color="#fff" activeColor="text.primary" isActive={router.route === link}>
                {t(title)}
              </Link>
            </ListItem>
          ) : null
        )}
      </List>
    </section>
  );
};

export default Footer;
