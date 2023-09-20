import AppNavbar from "@/components/AppNavbar";
import { useProfileStore } from "@/stores/profile";
import { getRoutes } from "@/routes";

export default function PrivateLayout({ children }: { children: JSX.Element }) {
  const userData = useProfileStore((state) => state.userData);
  const routes = getRoutes("userRoutes", "rendered", userData?.group.id === 4 ? "notary" : "user");

  return (
    <AppNavbar type="private" routes={routes}>
      {children}
    </AppNavbar>
  );
}
