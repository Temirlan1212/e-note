import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";
import { getRoutes } from "@/routes/data";
import { guestRoutes } from "@/routes/guest";

const routes = getRoutes(guestRoutes, "menu", "user", true);

export default function PublicLayout({ children }: { children: JSX.Element }) {
  return (
    <AppNavbar type="public" routes={routes}>
      {children}
      <Footer />
    </AppNavbar>
  );
}
