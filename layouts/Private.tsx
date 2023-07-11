export default function PrivateLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <div className="sidenav"></div>
      <main>{children}</main>
    </>
  );
}
