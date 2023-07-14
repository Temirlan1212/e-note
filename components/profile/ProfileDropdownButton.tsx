import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profile";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { IUser } from "@/models/profile/user";

export default function ProfileDropdownButton() {
  const router = useRouter();
  const t = useTranslations();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);

  useEffect(() => {
    setUser(profile.getUser());
  });

  const handleLogin = async () => {
    const data = {
      username: "admin",
      password: "admin",
    };
    await profile.logIn(data);
    setUser(profile.getUser());
    // console.log(profile.getUser());
  };

  const handleLogout = () => {
    profile.logOut();
    setUser(profile.getUser());
    // console.log(profile.getUser());
  };

  if (user) {
    return (
      <Button
        color="inherit"
        sx={{ textTransform: "none", display: { xs: "none", lg: "flex" } }}
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        {t("Logout")}
      </Button>
    );
  }

  return (
    <Button
      color="inherit"
      sx={{ textTransform: "none", display: { xs: "none", lg: "flex" } }}
      startIcon={<LoginIcon />}
      onClick={handleLogin}
    >
      {t("Login")}
    </Button>
  );
}
