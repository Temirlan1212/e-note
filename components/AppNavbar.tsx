import { useState } from "react";
import { useRouteStore } from "@/stores/route";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Box from "@mui/material/Box";
import MuiDrawer, { DrawerProps } from "@mui/material/Drawer";
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

const drawerWidth = 280;
let drawerType: "private" | "public" = "public";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    overflowX: "hidden",
  },
  ...(open && {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
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
      width: drawerType === "private" ? `calc(${theme.spacing(8)} + 1px)` : 0,
      [theme.breakpoints.down("md")]: {
        width: 0,
      },
    },
  }),
}));

interface IAppNavbarProps extends DrawerProps {
  type: "private" | "public";
}

export default function AppNavbar({ children, type }: IAppNavbarProps) {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations();
  const routes = useRouteStore((state) => state);
  const [open, setOpen] = useState(false);

  drawerType = type;

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
            pl: { xs: 2, sm: 3, md: drawerType === "private" ? "88px !important" : 3 },
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

          <Box sx={{ display: drawerType === "private" ? "none" : { xs: "none", md: "flex" }, gap: "15px" }}>
            {routes.items.map((route) => (
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
        PaperProps={{ sx: { backgroundColor: "success.main" } }}
      >
        <DrawerHeader>
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
        </DrawerHeader>

        <Divider sx={{ backgroundColor: "#33d599" }} />

        <List>
          {routes.items.map((route) => (
            <ListItem key={route.link} disablePadding>
              <Link key={route.link} href={route.link} isActive={route.link === router.pathname} width="100%">
                <ListItemButton
                  sx={{
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0, color: "#fff" }}>{t(route.title)}</ListItemText>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ pl: { xs: 0, md: drawerType === "private" ? 8 : 0 } }}>
        {children}
      </Box>
    </Box>
  );
}
