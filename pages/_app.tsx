import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "@/themes/default";
import { useProfileStore } from "@/stores/profile";
import { IRoute, useRouteStore } from "@/stores/route";
import { IUser } from "@/models/profile/user";
import Notification from "@/components/ui/Notification";
import useNotificationStore from "@/stores/notification";

function Layout({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const routes = useRouteStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);
  const [guestRoutes, setGuestRoutes]: [IRoute[], Function] = useState([]);

  useEffect(() => {
    setUser(profile.user);

    /**
     * Route redirects
     */
    if (router.route === "/login" && profile.user != null) {
      router.push("/profile");
    }
    if (router.route === "/profile" && profile.user == null) {
      router.push("/");
    }
  }, [profile.user, router.route]);

  useEffect(() => {
    setGuestRoutes(routes.getRoutes(routes.guestRoutes, "all"));
  }, [routes.guestRoutes]);

  if (user != null && !guestRoutes.map((r) => r.link).includes(router.route)) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
}

export default function App({ Component, pageProps }: AppProps) {
  const notification = useNotificationStore((state) => state.notification);
  const open = useNotificationStore((state) => state.open);
  const setOpenNotification = useNotificationStore((state) => state.setOpenNotification);

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Notification
            open={open}
            onClose={handleCloseNotification}
            title={notification}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            variant="filled"
            severity="error"
          />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
