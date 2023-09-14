import { useEffect, useState } from "react";
import { IRoute } from "@/stores/route";
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
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Collapse from "@mui/material/Collapse";
import DynamicIcon from "./DynamicIcon";
import { darken, lighten } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "./ui/Link";
import ProfileDropdownButton from "./ProfileDropdownButton";
import LocaleSwitcher from "./LocaleSwitcher";
import Tooltip from "@mui/material/Tooltip";
import PopupNotifications from "@/components/notifications/PopupNotifications";

const DrawerListItems = ({ routes, open }: { routes: IRoute[]; open: boolean }) => {
  const router = useRouter();
  const t = useTranslations();

  const [openedGroup, setOpenedGroup] = useState<string | null>(null);

  const existOpenedGroup = routes.find(
    (route) => route.type === "group" && route?.children?.some((subRoute) => subRoute.link === router.route)
  );

  useEffect(() => {
    if (existOpenedGroup != null) {
      setOpenedGroup(existOpenedGroup.title);
    }
  }, [existOpenedGroup]);

  const handleGroupToggle = (group: string) => {
    setOpenedGroup(group === openedGroup ? null : group);
  };

  const path = routes.find((route) => route.link && router.route.includes(route.link));

  return (
    <>
      {routes.map((route) => {
        return (
          <Box
            key={route.title}
            sx={{
              backgroundColor: (theme) =>
                openedGroup === route.title ? darken(theme.palette.success.main, 0.1) : "success",
            }}
          >
            {route.type !== "link" && (
              <Tooltip title={t(route.title)} placement="right" arrow>
                <ListItem disablePadding onClick={() => route.type === "group" && handleGroupToggle(route.title)}>
                  <Link href={route.link !== router.route ? route.link : ""} width="100%">
                    <ListItemButton
                      sx={{
                        justifyContent: open ? "initial" : "center",
                        color: "#fff",
                        backgroundColor: (theme) =>
                          path?.link === route.link ? darken(theme.palette.success.main, 0.15) : "success",
                      }}
                    >
                      {route.icon && (
                        <ListItemIcon sx={{ color: "inherit", minWidth: open ? "36px" : "auto" }}>
                          <DynamicIcon name={route.icon} />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "inherit",
                        }}
                      >
                        {t(route.title)}
                      </ListItemText>
                      {route.type === "group" &&
                        open &&
                        (openedGroup === route.title ? <ExpandLess color="inherit" /> : <ExpandMore color="inherit" />)}
                    </ListItemButton>
                  </Link>
                </ListItem>
              </Tooltip>
            )}

            {route.type !== "link" && route.bottomDivider && (
              <Divider sx={{ backgroundColor: (theme) => lighten(theme.palette.success.main, 0.5) }} />
            )}

            {route.type === "group" && route.children != null && (
              <Collapse in={openedGroup === route.title} timeout="auto" unmountOnExit>
                <List>
                  <DrawerListItems routes={route.children} open={open} />
                </List>
              </Collapse>
            )}
          </Box>
        );
      })}
    </>
  );
};

interface IAppNavbarProps extends DrawerProps {
  type: "private" | "public";
  routes: IRoute[];
}

export default function AppNavbar({ children, type, routes }: IAppNavbarProps) {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const handleDrawerToggle = (e?: any, v?: boolean) => {
    if (e?.stopPropagation != null) e.stopPropagation();
    setOpen((open) => v ?? !open);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CssBaseline />

      <AppBar
        component="nav"
        position="static"
        color="transparent"
        sx={{ boxShadow: "none" }}
        onClick={(e) => handleDrawerToggle(e, false)}
      >
        <Toolbar
          sx={{
            gap: "15px",
            justifyContent: "space-between",
            backgroundColor: "white",
            pl: { xs: 2, sm: 3, md: type === "private" ? 10 : 3 },
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && {
              transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: { xs: 0, md: "224px" },
            }),
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

          {type === "public" && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: "15px",
              }}
            >
              {routes.map((route) => (
                <Link key={route.link} href={route.link} isActive={route.link === router.route} color={"text.primary"}>
                  {t(route.title)}
                </Link>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {type === "private" && <PopupNotifications />}
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
        variant="permanent"
        PaperProps={{ sx: { backgroundColor: "success.main", overflowX: "hidden" } }}
        sx={{
          whiteSpace: "nowrap",
          ...(open && {
            "& .MuiDrawer-paper": {
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxShadow: 10,
              width: 280,
            },
          }),
          ...(!open && {
            "& .MuiDrawer-paper": {
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              boxShadow: 1,
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

        <Divider sx={{ backgroundColor: (theme) => lighten(theme.palette.success.main, 0.5) }} />

        <List>
          <DrawerListItems routes={routes} open={open} />
        </List>
      </Drawer>

      <Box
        component="main"
        onClick={(e) => handleDrawerToggle(e, false)}
        sx={{
          flex: 1,
          pl: { xs: 0, md: type === "private" ? 7 : 0 },
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: { xs: 0, md: "224px" },
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
