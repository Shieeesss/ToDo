import QueryProvider from "@/lib/QueryProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <header>{/* Navbar or global elements */}</header>
          <main>{children}</main>
          <footer>{/* Footer */}</footer>
        </QueryProvider>
      </body>
    </html>
  );
}