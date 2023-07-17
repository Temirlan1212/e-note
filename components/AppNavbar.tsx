import { useState } from "react";
import { useRouteStore } from "@/stores/route";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Box from "@mui/material/Box";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Link from "./ui/Link";
import ProfileDropdownButton from "./ProfileDropdownButton";
import LocaleSwitcher from "./LocaleSwitcher";
import InboxIcon from "@mui/icons-material/MoveToInbox";

interface IAppNavbarProps extends DrawerProps {
  type: "private" | "public";
}

export default function AppNavbar({ children, type }: IAppNavbarProps) {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations();
  const guestRoutes = useRouteStore((state) => state.guestRoutes).filter((r) => r.type === "menu");
  const userRoutes = useRouteStore((state) => state.userRoutes);
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen((open) => !open);
  };

  return (
    <Box>
      <CssBaseline />

      <AppBar component="nav" position="sticky" color="transparent" sx={{ boxShadow: "none" }}>
        <Toolbar
          sx={{
            gap: "15px",
            justifyContent: "space-between",
            pl: { xs: 2, sm: 3, md: type === "private" ? 10 : 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Link href="/" sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image src="/images/logo.png" alt="E-notariat" width={48} height={48} />
              <Typography variant="h6" color="text.primary" fontWeight={600} whiteSpace="nowrap">
                E-NOTARIAT
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: type === "private" ? "none" : { xs: "none", md: "flex" }, gap: "15px" }}>
            {guestRoutes.map((route) => (
              <Link key={route.link} href={route.link} isActive={route.link === router.pathname} color={"text.primary"}>
                {t(route.title)}
              </Link>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <ProfileDropdownButton />
            <LocaleSwitcher />

            <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { md: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={handleDrawerToggle}
        variant="permanent"
        PaperProps={{ sx: { backgroundColor: "success.main", overflowX: "hidden" } }}
        sx={{
          whiteSpace: "nowrap",
          ...(open && {
            "& .MuiDrawer-paper": {
              width: 280,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }),
          ...(!open && {
            "& .MuiDrawer-paper": {
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: type === "private" ? `calc(${theme.spacing(7)} + 1px)` : 0,
              [theme.breakpoints.down("md")]: {
                width: 0,
              },
            },
          }),
        }}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
          })}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "#fff", display: { xs: "none", md: open ? "none" : "flex" } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "#fff", display: { xs: "flex", md: open ? "flex" : "none" } }}
          >
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: "#33d599" }} />

        <List>
          {type === "public" &&
            guestRoutes.map((route) => (
              <ListItem key={route.link} disablePadding>
                <Link href={route.link} isActive={route.link === router.pathname} width="100%">
                  <ListItemButton
                    sx={{
                      justifyContent: open ? "initial" : "center",
                    }}
                  >
                    <ListItemIcon sx={{ color: "#fff", minWidth: open ? "36px" : "auto" }}>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText sx={{ opacity: open ? 1 : 0, color: "#fff" }}>{t(route.title)}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          {type === "private" && userRoutes.map((route) => <></>)}
        </List>
      </Drawer>

      <Box component="main" sx={{ pl: { xs: 0, md: type === "private" ? 7 : 0 } }}>
        {children}
      </Box>
    </Box>
  );
}
