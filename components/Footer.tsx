import { Box, Container, List, ListItem, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { WhatsApp, Instagram, Facebook } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { routes } from "@/routes/guest";
import { getRoutes } from "@/routes/data";

interface IFooterDataItem {
  title: string;
  link: string;
  content?: string;
}

interface IFooterSection {
  title: string;
  items: IFooterDataItem[];
}

const guestRoutes = getRoutes(routes, "menu");

const Footer: React.FC = () => {
  const t = useTranslations();
  const footerData: Record<string, IFooterDataItem[]> = {
    Links: guestRoutes.map((route) => ({
      title: route.title,
      link: route.link,
    })),
    Contacts: [
      { title: "Address: Bishkek, blvd Molodoy Guardii 32", link: "https://go.2gis.com/divf1" },
      { title: "Phone number", content: ": +996 (312) 65-10-10", link: "tel:+996312651010" },
      { title: "E-mail", content: ": ep@minjust.gov.kg", link: "mailto:ep@minjust.gov.kg" },
      { title: "Working hours: Mon-Fri, 09:00-18:00", link: "/#" },
    ],
  };

  const footerIconsData = [
    { icon: WhatsApp, url: "https://whatsapp.com" },
    { icon: Facebook, url: "https://ru-ru.facebook.com" },
    { icon: Instagram, url: "https://www.instagram.com" },
  ];

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
        {items.map(({ title, link, content }, index) =>
          title ? (
            <ListItem sx={{ padding: "0 0 24px 0" }} key={index}>
              <Link href={link} color="#fff" activeColor="text.primary" isActive={router.route === link}>
                {t(title)}
                {content}
              </Link>
            </ListItem>
          ) : null
        )}
      </List>
    </section>
  );
};

export default Footer;
