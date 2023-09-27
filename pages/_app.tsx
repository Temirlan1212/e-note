import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "@/themes/default";
import { useProfileStore } from "@/stores/profile";
import useNotificationStore from "@/stores/notification";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IUser } from "@/models/user";
import NavigationLoading from "@/components/ui/NavigationLoading";
import Notification from "@/components/ui/Notification";
import { routes } from "@/routes/guest";
import { getRoutes, isRoutesIncludesPath } from "@/routes/data";

const guestRoutes = getRoutes(routes, "rendered");

function Layout({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffectOnce(() => {
    switch (router.asPath) {
      case "/login":
        if (profile.user != null)
          if (previousPath != null && !isRoutesIncludesPath(guestRoutes, previousPath)) {
            router.push(previousPath);
          } else {
            router.push("/applications");
          }
        break;
      case "/profile":
        if (profile.user == null) router.push("/");
        break;
      default:
        setPreviousPath(router.asPath);
    }

    setUser(profile.user);
  }, [profile.user, router.route]);

  if (user != null && router.asPath.length > 1 && !isRoutesIncludesPath(guestRoutes, router.asPath)) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
}

export default function App({ Component, pageProps }: AppProps) {
  const notification = useNotificationStore((state) => state.notification);
  const setCloseNotification = useNotificationStore((state) => state.setNotification);

  const handleCloseNotification = (): void => {
    setCloseNotification(null);
  };

  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ThemeProvider theme={theme}>
        <NavigationLoading>
          <Notification
            open={!!notification}
            onClose={handleCloseNotification}
            onCloseAlert={handleCloseNotification}
            title={notification ?? "Oops"}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            variant="filled"
            severity="error"
          />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NavigationLoading>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
