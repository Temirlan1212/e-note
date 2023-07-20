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
import { useDictionaryStore } from "@/stores/dictionaries";
import { shallow } from "zustand/shallow";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const routes = useRouteStore((state) => state);

  const { getActionTypeData, getStatusData, getDocumentTypeData } = useDictionaryStore();

  const { actionTypeData, statusData, documentTypeData } = useDictionaryStore(
    ({ actionTypeData, statusData, documentTypeData }) => ({
      actionTypeData,
      statusData,
      documentTypeData,
    }),
    shallow
  );

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

  useEffect(() => {
    getActionTypeData({ translate: true });
    getStatusData({ translate: true });
    getDocumentTypeData({ translate: true, fields: ["fullName", "name"] });
  }, []);

  useEffect(() => {
    if (actionTypeData != null) {
      console.log(actionTypeData);
    }
    // if (statusData != null) {
    //   console.log(statusData);
    // }
    // if (statusData != null) {
    //   console.log(documentTypeData);
    // }
  }, [
    actionTypeData,
    // statusData,
    //  documentTypeData
  ]);

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
