import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import LocaleSwitcher from "./LocaleSwitcher";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useRouteStore } from "@/store/route-store";
import Link from "./Link";

export default function TopNavbar() {
  const router = useRouter();
  const t = useTranslations();
  const routes = useRouteStore((state) => state);
  const drawerWidth = 280;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar component="nav" position="sticky" color="transparent" sx={{ boxShadow: "none" }}>
        <Container>
          <Toolbar sx={{ gap: "15px", justifyContent: "space-between", padding: "0px !important" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { md: "none" } }}>
                <MenuIcon />
              </IconButton>

              <Link href="/" sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Image src="/images/logo.png" alt="E-notariat" width={48} height={48} />
                <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>E-NOTARIAT</Typography>
              </Link>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "15px" }}>
              {routes.items.map((route) => (
                <Link key={route.link} href={route.link} isActive={route.link === router.pathname}>
                  {t(route.title)}
                </Link>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Button
                color="inherit"
                sx={{ textTransform: "none", display: { xs: "none", lg: "flex" } }}
                startIcon={<PersonOutlineIcon />}
              >
                Личный кабинет
              </Button>

              <IconButton color="inherit" sx={{ display: { lg: "none" } }}>
                <PersonOutlineIcon />
              </IconButton>
              <LocaleSwitcher />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <List>
              {routes.items.map((route) => (
                <ListItem key={route.link} disablePadding>
                  <ListItemButton sx={{ textAlign: "center" }}>
                    <Link key={route.link} href={route.link} isActive={route.link === router.pathname}>
                      {t(route.title)}
                    </Link>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
