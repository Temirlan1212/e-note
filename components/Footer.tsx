import { Box, Container, List, ListItem, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { WhatsApp, Instagram, Facebook } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface IFooterDataItem {
  content: string;
  route: string;
}

interface IFooterSection {
  title: string;
  items: IFooterDataItem[];
}

const footerData: Record<string, IFooterDataItem[]> = {
  Community: [
    { content: "About us", route: "/about" },
    { content: "Usability", route: "/" },
    { content: "Marketplace", route: "/" },
    { content: "Design & Dev", route: "/" },
  ],
  Sample: [
    { content: "About us", route: "/about" },
    { content: "Usability", route: "/" },
    { content: "Marketplace", route: "/" },
    { content: "Design & Dev", route: "/" },
  ],
  Resource: [
    { content: "Accessibility", route: "/" },
    { content: "Usability", route: "/" },
    { content: "Marketplace", route: "/" },
    { content: "Design & Dev", route: "/" },
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
              <Typography variant="h6" color="text.secondary">
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
            <Image src="/images/website-analytics.png" alt="website-analytics" width={107} height={38} />
            <Typography color="text.secondary">{t("2023 E-Notariat All rights Reserved")}</Typography>
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

  return (
    <section>
      <Typography variant="h5" padding="0 0 20px 0" color="text.secondary">
        {t(title)}
      </Typography>

      <List>
        {items.map((item) =>
          item.content ? (
            <ListItem sx={{ padding: "0 0 24px 0" }} key={item.content}>
              <Link href={item.route}>
                <Typography color="text.secondary">{t(item.content)}</Typography>
              </Link>
            </ListItem>
          ) : null
        )}
      </List>
    </section>
  );
};

export default Footer;
