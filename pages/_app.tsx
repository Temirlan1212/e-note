import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { SnackbarProvider } from "notistack";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "@/themes/default";
import { useProfileStore } from "@/stores/profile";
import { IRoute, useRouteStore } from "@/stores/route";
import { IUser } from "@/models/profile/user";

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
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SnackbarProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
