import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import theme from "@/themes/default";
import { useProfileStore } from "@/stores/profile";
import useNotificationStore from "@/stores/notification";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IUser } from "@/models/user";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import Button from "@/components/ui/Button";
import NavigationLoading from "@/components/ui/NavigationLoading";
import Notification from "@/components/ui/Notification";
import { routes as guestRoutes } from "@/routes/guest";
import { routes as userRoutes } from "@/routes/user";
import { getRoutes, isRoutesIncludesPath } from "@/routes/data";

const guestRoutesRendered = getRoutes(guestRoutes, "rendered");
const userRoutesRendered = getRoutes(userRoutes, "rendered");

function Layout({ children }: { children: JSX.Element }) {
  const t = useTranslations();
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { loading, update: setRole } = useFetch("", "GET");

  useEffectOnce(async () => {
    const params = new URL(document.location.toString()).searchParams;
    const code = params.get("code");

    if (code != null) {
      // profile.logInEsi(code);
      console.log(code);
    }
  });

  useEffectOnce(() => {
    setUser(profile.user);

    if (!profile.userRoleSelected && profile.userData?.activeCompany != null) {
      return setIsOpen(true);
    }

    return redirect();
  }, [profile.userData, router.route]);

  const redirect = async () => {
    if (profile.user == null && isRoutesIncludesPath(userRoutesRendered, router.route)) {
      router.push("/");
      setPreviousPath(router.route);
    }

    if (profile.user != null && previousPath != null) {
      router.push(previousPath);
      setPreviousPath(null);

      if (router.route === "/login" || router.route === "/") {
        router.push("/applications");
      }
    }
  };

  const handleChooseRole = async (role: 1 | 2) => {
    const result = await setRole("/api/user/select?type=" + role);
    if (result?.status === 0 && profile.user != null) {
      setIsOpen(false);
      profile.loadUserData(profile.user);
      profile.setUserRoleSelected(true);
    }
  };

  if (user != null && router.asPath.length > 1 && !isRoutesIncludesPath(guestRoutesRendered, router.asPath)) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  return (
    <PublicLayout>
      <>
        {children}
        <ConfirmationModal
          isPermanentOpen={isOpen}
          title="Enter as"
          type="hint"
          hintTitle=""
          hintText="Enter as description"
          slots={{
            button: () => (
              <Box display="flex" alignItems="center" justifyContent="center" gap="16px" width="100%">
                {loading && <CircularProgress sx={{ justifyContent: "center" }} />}
                {!loading && (
                  <>
                    <Button onClick={() => handleChooseRole(1)}>{t("Notary")}</Button>
                    <Button onClick={() => handleChooseRole(2)}>{t("Applicant")}</Button>
                  </>
                )}
              </Box>
            ),
          }}
        />
      </>
    </PublicLayout>
  );
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
