import { Inter } from "next/font/google"

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
  <div className={`bg-white ${inter.className} min-h-screen`}>
    {/* Navbar */}
    {/* Override navbar to be static (not fixed) */}
   
    <main className="">{children}</main>
  </div>
  );
  }
  