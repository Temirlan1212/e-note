import { IRoute, useRouteStore } from "@/stores/route";
import { useEffect, useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: JSX.Element }) {
  const routes = useRouteStore((state) => state.getRoutes(state.guestRoutes, "menu", "user", true));

  return (
    <>
      <AppNavbar type="public" routes={routes}>
        {children}
      </AppNavbar>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
