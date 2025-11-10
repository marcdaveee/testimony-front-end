import { NavBar } from "./_components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="container mx-auto">{children}</div>
    </>
  );
}
