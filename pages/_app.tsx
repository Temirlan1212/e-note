import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "@/themes/default";
import { useProfileStore } from "@/stores/profile";
import { IUser } from "@/models/profile/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRouteStore } from "@/stores/route";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const routes = useRouteStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);
  const [guestRoutes, setGuestRoutes]: [typeof routes.guestRoutes, Function] = useState([]);

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
  }, [profile.user]);

  useEffect(() => {
    setGuestRoutes(routes.guestRoutes);
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
