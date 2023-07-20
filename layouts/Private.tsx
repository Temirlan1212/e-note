import { IRoute, useRouteStore } from "@/stores/route";
import { useEffect, useState } from "react";
import AppNavbar from "@/components/AppNavbar";

export default function PrivateLayout({ children }: { children: JSX.Element }) {
  const routes = useRouteStore((state) => state);

  const [userRoutes, setUserRoutes]: [IRoute[], Function] = useState([]);

  useEffect(() => {
    setUserRoutes(routes.getRoutes(routes.userRoutes));
  }, [routes.userRoutes]);

  return (
    <>
      <AppNavbar type="private" routes={userRoutes}>
        {children}
      </AppNavbar>
    </>
  );
}
