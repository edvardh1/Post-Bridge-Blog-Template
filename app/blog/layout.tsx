


export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
  <div className="bg-[#141414] min-h-screen">
    {/* Navbar */}
    {/* Override navbar to be static (not fixed) */}
   
    <main className="">{children}</main>
  </div>
  );
  }
  