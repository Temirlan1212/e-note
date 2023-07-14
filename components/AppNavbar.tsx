import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Image from "next/image";
import Box, { BoxProps } from "@mui/material/Box";
import MuiDrawer, { DrawerProps } from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Link from "./ui/Link";
import { AppProps } from "next/app";

const drawerWidth = 280;

interface IAppNavbarProps extends DrawerProps {
  topMenu: {
    show: boolean;
  };
  drawerMenuButton: {
    position: "left" | "right";
    show: "all" | "mobile";
  };
  drawerMenu: {
    type: "full" | "half";
  };
}

export default function AppNavbar({ children, drawerMenuButton, topMenu }: IAppNavbarProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Box component="main">{children}</Box>
    </Box>
  );
}
