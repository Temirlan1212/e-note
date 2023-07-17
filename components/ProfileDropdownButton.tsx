import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/profile";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { IUser } from "@/models/profile/user";
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

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenu(null);
  };

  useEffect(() => {
    setUser(profile.user);
  }, [profile.user]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    profile.logOut();
    setUser(profile.getUser());
  };

  if (user) {
    return (
      <>
        <IconButton color="inherit" sx={{ display: { lg: "none" } }} onClick={handleMenuClick}>
          <PersonOutlineIcon />
        </IconButton>
        <Button
          color="inherit"
          sx={{ textTransform: "none", display: { xs: "none", lg: "flex" } }}
          startIcon={<PersonOutlineIcon />}
          onClick={handleMenuClick}
        >
          {user.username}
        </Button>
        <Menu anchorEl={menu} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => router.push("/profile")}>{t("Profile")}</MenuItem>
          <MenuItem onClick={() => handleLogout()}>{t("Logout")}</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <IconButton color="inherit" sx={{ display: { lg: "none" } }} onClick={handleLogin}>
        <LoginIcon />
      </IconButton>
      <Button
        color="inherit"
        sx={{ display: { xs: "none", lg: "flex" } }}
        startIcon={<LoginIcon />}
        onClick={handleLogin}
      >
        {t("Login")}
      </Button>
    </>
  );
}
