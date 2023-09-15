import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/profile";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { IUser } from "@/models/user";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LoginIcon from "@mui/icons-material/Login";

export default function ProfileDropdownButton() {
  const router = useRouter();
  const t = useTranslations();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState<IUser | null>(null);
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const open = !!menu;

  useEffect(() => {
    setUser(profile.user);
  }, [profile.user]);

  const handleMenuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(menu == null ? event.currentTarget : null);
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setMenu(null);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {
    router.push("/");
    if (router.pathname === "/") {
      profile.logOut();
    }
    setUser(profile.getUser());
  };

  if (user) {
    return (
      <>
        <IconButton color="inherit" sx={{ display: { lg: "none" } }} onClick={handleMenuToggle}>
          <PersonOutlineIcon />
        </IconButton>
        <Button
          color="inherit"
          sx={{ textTransform: "none", display: { xs: "none", lg: "flex" } }}
          startIcon={<PersonOutlineIcon />}
          onClick={handleMenuToggle}
        >
          {user.username}
        </Button>
        <Menu anchorEl={menu} open={open} onClose={handleMenuToggle}>
          <MenuItem onClick={handleProfileClick}>{t("Profile")}</MenuItem>
          <MenuItem onClick={handleLogoutClick}>{t("Logout")}</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <IconButton color="inherit" sx={{ display: { lg: "none" } }} onClick={handleLoginClick}>
        <LoginIcon />
      </IconButton>
      <Button
        color="inherit"
        sx={{ display: { xs: "none", lg: "flex" } }}
        startIcon={<LoginIcon />}
        onClick={handleLoginClick}
      >
        {t("Login")}
      </Button>
    </>
  );
}
