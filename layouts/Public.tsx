import TopNavbar from "@/components/TopNavbar";

export default function PublicLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <header>
        <TopNavbar></TopNavbar>
      </header>
      <main>{children}</main>
    </>
  );
}
