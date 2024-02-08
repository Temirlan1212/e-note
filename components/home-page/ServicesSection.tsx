import { List, ListItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import CheckDocIcon from "@/public/icons/check-doc.svg";
import CarIcon from "@/public/icons/car.svg";
import SearchHeirs from "@/public/icons/search-heirs.svg";
import HereditaryAffairs from "@/public/icons/hereditary-affairs.svg";
import Register from "@/public/icons/register.svg";
import Link from "@/components/ui/Link";

const ServicesSection: React.FC = () => {
  const t = useTranslations();

  const servicesData = [
    { title: "Verification of the power of attorney", link: "/check-document", icon: CheckDocIcon },
    { title: "Checking of mortgaged movable property", link: "/check-movable-property", icon: CarIcon },
    { title: "Search for heirs", link: "/search-for-heirs", icon: SearchHeirs },
    { title: "Hereditary affairs", link: "/inheritance-cases", icon: HereditaryAffairs },
    { title: "Register of Notaries of the KR", link: "/notaries", icon: Register },
  ];

  return (
    <section>
      <Typography variant="h1" fontWeight={600} sx={{ marginBottom: { md: "50px", xs: "30px" } }}>
        {t("Services and public registries")}
      </Typography>

      <List
        disablePadding
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          justifyContent: "flex-start",
          alignItems: { xs: "center", sm: "flex-start" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {servicesData.map(({ title, icon: Icon, link }, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: "flex",
              width: { xs: "100%", sm: "auto" },
              padding: "40px 20px 20px 20px",
              "&:hover": { color: "white", bgcolor: "info.light", transition: "all 0.2s ease" },
              cursor: "pointer",
              flexGrow: 1,
              height: "242px",
              maxWidth: "100%",
              minWidth: { xs: "auto", sm: "230px" },
              justifyContent: "center",
            }}
          >
            <Link
              href={link}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                gap: "20px",
              }}
            >
              <Icon />
              <Typography textAlign="center" fontWeight={600} maxWidth={160}>
                {t(title)}
              </Typography>
            </Link>
          </ListItem>
        ))}
      </List>
    </section>
  );
};

export default ServicesSection;
