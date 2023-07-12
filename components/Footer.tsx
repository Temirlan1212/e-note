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
  Community: [
    { title: "About us", link: "/about" },
    { title: "Usability", link: "/usability" },
    { title: "Marketplace", link: "/marketplace" },
    { title: "Design & Dev", link: "/design" },
  ],
  Sample: [
    { title: "Usability", link: "/usability" },
    { title: "Usability", link: "/usability" },
    { title: "Marketplace", link: "/marketplace" },
    { title: "Design & Dev", link: "/design" },
  ],
  Resource: [
    { title: "Accessibility", link: "/accessibility" },
    { title: "Usability", link: "/usability" },
    { title: "Usability", link: "/usability" },
    { title: "Design & Dev", link: "/design" },
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
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
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
  const router = useRouter();

  return (
    <section>
      <Typography variant="h5" padding="0 0 20px 0" color="text.secondary">
        {t(title)}
      </Typography>

      <List>
        {items.map(({ title, link }, index) =>
          title ? (
            <ListItem sx={{ padding: "0 0 24px 0" }} key={index}>
              <Link href={link} color="text.secondary" activeColor="text.primary" isActive={router.route === link}>
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
