import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/profile";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { IUserData } from "@/models/user";
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
  const [userData, setUserData]: [IUserData | null, Function] = useState<IUserData | null>(null);
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const open = !!menu;

  useEffect(() => {
    setUserData(profile.userData);
  }, [profile.userData]);

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
    profile.logOut();
    setUserData(profile.getUserData());
  };

  if (userData) {
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
          {userData.partner?.fullName || userData.activeCompany?.name}
        </Button>
        <Menu anchorEl={menu} open={open} onClose={handleMenuToggle}>
          <MenuItem onClick={handleProfileClick}>{t("Personal account")}</MenuItem>
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
