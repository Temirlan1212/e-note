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

export default function App({ Component, pageProps }: AppProps) {
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

  const Layout = () => {
    if (user != null && !guestRoutes.map((r) => r.link).includes(router.route)) {
      return (
        <PrivateLayout>
          <Component {...pageProps} />
        </PrivateLayout>
      );
    }

    return (
      <PublicLayout>
        <Component {...pageProps} />
      </PublicLayout>
    );
  };

  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ThemeProvider theme={theme}>
        <Layout />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
