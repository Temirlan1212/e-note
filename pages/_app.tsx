import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme/default";
import { useProfileStore } from "@/store/profile";
import { IUser } from "@/models/profile/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GuestRouteList } from "@/store/route";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);

  useEffect(() => {
    setUser(profile.user);
  }, [profile.user]);

  const Layout = () => {
    if (user != null && !GuestRouteList.map((r) => r.link).includes(router.route)) {
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
