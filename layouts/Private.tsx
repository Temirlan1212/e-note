import AppNavbar from "@/components/AppNavbar";

export default function PrivateLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <AppNavbar type="private">{children}</AppNavbar>
    </>
  );
}
