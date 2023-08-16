import { IRoute, useRouteStore } from "@/stores/route";
import { useEffect, useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import { useProfileStore } from "@/stores/profile";

export default function PrivateLayout({ children }: { children: JSX.Element }) {
  const userData = useProfileStore((state) => state.userData);
  const routes = useRouteStore((state) =>
    state.getRoutes(state.userRoutes, "rendered", userData?.group.id === 4 ? "notary" : "user")
  );

  return (
    <>
      <AppNavbar type="private" routes={routes}>
        {children}
      </AppNavbar>
    </>
  );
}
