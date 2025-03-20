import QueryProvider from "@/lib/QueryProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
      </head>
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