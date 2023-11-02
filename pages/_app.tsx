import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { Backdrop, Box, CircularProgress, ThemeProvider } from "@mui/material";
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
import FaceIdScanner from "@/components/face-id/FaceId";

const guestRoutesRendered = getRoutes(guestRoutes, "rendered");
const userRoutesRendered = getRoutes(userRoutes, "rendered");

function Layout({ children }: { children: JSX.Element }) {
  const t = useTranslations();
  const router = useRouter();
  const profile = useProfileStore((state) => state);
  const [user, setUser]: [IUser | null, Function] = useState(null);
  const [redirectTo, setRedirectTo] = useState<string | null>("/applications");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  const [faceIdScannerOpen, setFaceIdScannerOpen] = useState<boolean>(false);
  const [faceIdScanner, setFaceIdScanner] = useState(false);

  const { loading, update: setRole } = useFetch("", "GET");

  useEffectOnce(async () => {
    const params = new URL(document.location.toString()).searchParams;
    const code = params.get("code");

    if (code != null) {
      setIsBackdropOpen(true);
      await profile.logInEsi(code);
      setIsBackdropOpen(false);
    }
  });

  useEffectOnce(async () => {
    setUser(profile.user);

    if (!profile.userRoleSelected && profile.userData?.activeCompany != null) {
      return setIsRoleModalOpen(true);
    }

    const isPrivateRoute = router.route.length > 1 && isRoutesIncludesPath(userRoutesRendered, router.route);

    if (profile.user == null && isPrivateRoute) {
      setRedirectTo(router.route);
      return router.push("/");
    }

    if (profile.user != null && redirectTo != null) {
      await router.push(redirectTo);
      return setRedirectTo(null);
    }

    if (profile.user != null && router.route === "/login") {
      return setRedirectTo("/applications");
    }
  }, [profile.userData, router.route]);

  const handleChooseRole = async (role: 1 | 2) => {
    await setRole("/api/user/select?type=" + role);
    setFaceIdScannerOpen(role === 1 && (user as any)?.username === "21904198400001");
    if ((user as any)?.username !== "21904198400001" || role === 2) {
      setIsRoleModalOpen(false);
      profile.loadUserData(profile?.user!);
      profile.setUserRoleSelected(true);
    }
  };

  useEffect(() => {
    if ((user as any)?.username === "21904198400001" && faceIdScanner) {
      setFaceIdScannerOpen(false);
      setIsRoleModalOpen(false);
      profile.loadUserData(profile?.user!);
      profile.setUserRoleSelected(true);
    }
  }, [faceIdScanner]);

  if (user != null && router.asPath.length > 1 && !isRoutesIncludesPath(guestRoutesRendered, router.asPath)) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  const handleLogout = () => {
    profile.logOut();
    router.push("/");
    setIsRoleModalOpen(false);
    setFaceIdScannerOpen(false);
  };

  return (
    <PublicLayout>
      <>
        {children}
        <Backdrop open={isBackdropOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress sx={{ justifyContent: "center" }} size={60} />
        </Backdrop>
        <ConfirmationModal
          isPermanentOpen={faceIdScannerOpen}
          isCloseIconShown={true}
          onToggle={handleLogout}
          title="Confirmation of identity"
          type="hint"
          hintTitle=""
          hintText="Verify with your face id"
          slots={{
            body: () => <FaceIdScanner getStatus={(status) => setFaceIdScanner(status)} />,
            button: () => <></>,
          }}
        />
        <ConfirmationModal
          isPermanentOpen={isRoleModalOpen}
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
