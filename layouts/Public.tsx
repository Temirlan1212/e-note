import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <AppNavbar type="public">{children}</AppNavbar>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
