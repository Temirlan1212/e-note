import { IRoute, useRouteStore } from "@/stores/route";
import { useEffect, useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: JSX.Element }) {
  const routes = useRouteStore((state) => state);

  const [guestRoutes, setGuestRoutes]: [IRoute[], Function] = useState([]);

  useEffect(() => {
    setGuestRoutes(routes.getRoutes(routes.guestRoutes, "menu", true));
  }, [routes.guestRoutes]);

  return (
    <>
      <AppNavbar type="public" routes={guestRoutes}>
        {children}
      </AppNavbar>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
