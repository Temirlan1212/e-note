import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IRoute, isRoutesIncludesPath } from "@/routes/data";
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
import Tooltip from "@mui/material/Tooltip";
import { darken, lighten } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "./ui/Link";
// import DynamicIcon from "./DynamicIcon";
import ProfileDropdownButton from "./ProfileDropdownButton";
import LocaleSwitcher from "./LocaleSwitcher";
import PopupNotifications from "./PopupNotifications";
import ScrollToTopFab from "./ScrollToTopFab";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SchoolIcon from "@mui/icons-material/School";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import useInstructionStore from "@/stores/instruction";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

const DrawerListItems = ({
  routes,
  open,
  closeDrawer,
}: {
  routes: IRoute[];
  open: boolean;
  closeDrawer?: (e?: any, v?: boolean) => void;
}) => {
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

  const handleClose = (route: IRoute) => {
    if (route.type === "menu" && typeof closeDrawer === "function") {
      closeDrawer();
    }
  };

  return (
    <>
      {routes.map((route) => {
        const path = route.link.split("/")[1] === router.route.split("/")[1];
        return (
          <Box
            key={route.title}
            onClick={() => handleClose(route)}
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
                        backgroundColor: (theme) => (path ? darken(theme.palette.success.main, 0.15) : "success"),
                      }}
                    >
                      {route.icon && (
                        <ListItemIcon sx={{ color: "inherit", minWidth: open ? "36px" : "auto" }}>
                          {/* <DynamicIcon name={route.icon} /> */}
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
                <List onClick={closeDrawer}>
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
  const isMobileMedia = useMediaQuery("(max-width:500px)");
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const step = useInstructionStore((state) => state.step);

  const { data, loading, update } = useFetch<Response>("", "GET", { returnResponse: true });

  const getRoutePath = () => {
    const applicationRoute = ["create", "edit"].some((route) => router.pathname.includes(route));
    if (applicationRoute) {
      return step;
    }
    return router.pathname;
  };

  useEffectOnce(async () => {
    const binaryData = await data?.text();
    if (!!binaryData) {
      setVideoURL(binaryData);
    }
  }, [data]);

  useEffect(() => {
    setVideoURL(null);
  }, [router.pathname]);

  const handleDrawerToggle = (e?: any, v?: boolean) => {
    if (e?.stopPropagation != null) e.stopPropagation();
    setOpen((open) => v ?? !open);
  };

  const fetchVideo = useCallback(async () => {
    await update("/api/files/instruction?path=" + getRoutePath());
  }, [getRoutePath, update, videoURL]);

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
            flexWrap: isMobileMedia ? "wrap" : "unset",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              width: isMobileMedia ? "100%" : "unset",
              justifyContent: isMobileMedia ? "space-between" : "unset",
            }}
          >
            <Link href="/" sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image src="/images/logo.png" alt="E-notariat" width={48} height={48} />
              <Typography variant="h6" color="text.primary" fontWeight={600} whiteSpace="nowrap">
                E-NOTARIAT
              </Typography>
            </Link>
            <Link href="https://wa.me/+996503291223" target="_blank">
              <Tooltip title={t("Technical support (WhatsApp)")}>
                <IconButton sx={{ color: "inherit" }}>
                  <WhatsAppIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Link href="https://b10.okuukeremet.com/b/abd-cmd-vqe-ck9" target="_blank">
              <Tooltip title={t("Technical support (video call)")}>
                <IconButton sx={{ color: "inherit" }}>
                  <SupportAgentIcon />
                </IconButton>
              </Tooltip>
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              width: isMobileMedia ? "100%" : "unset",
              justifyContent: isMobileMedia ? "space-between" : "unset",
            }}
          >
            <ConfirmationModal
              title="Learning"
              isCloseIconShown={true}
              isHintShown={false}
              slots={{
                button: () => <></>,
                body: () => (
                  <Box width="100%" height="300px">
                    {videoURL ? (
                      <video width="100%" height="100%" src={`data:video/mp4;base64,${videoURL}`} controls></video>
                    ) : (
                      <Box height="100%">
                        <Typography align="center" color="info.main" variant="h5">
                          {t("Wait, it's loading")}...
                        </Typography>
                        <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                          <CircularProgress size={80} color="info" />
                        </Box>
                      </Box>
                    )}
                  </Box>
                ),
              }}
            >
              <Tooltip title={t("Learning")}>
                <IconButton onClick={fetchVideo} sx={{ color: "inherit" }}>
                  <SchoolIcon />
                </IconButton>
              </Tooltip>
            </ConfirmationModal>
            <LocaleSwitcher />
            <PopupNotifications />
            <ProfileDropdownButton />

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
          <DrawerListItems routes={routes} open={open} closeDrawer={() => handleDrawerToggle(null, false)} />
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

      <ScrollToTopFab />
    </Box>
  );
}
