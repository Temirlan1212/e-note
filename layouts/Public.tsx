import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";
import { getRoutes } from "@/routes";

const guestRoutes = getRoutes("guestRoutes", "menu", "user", true);

export default function PublicLayout({ children }: { children: JSX.Element }) {
  return (
    <AppNavbar type="public" routes={guestRoutes}>
      {children}
      <Footer />
    </AppNavbar>
  );
}
