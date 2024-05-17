import "@/styles/globals.css";
import { ReactNode } from "react";
import ClientProviders from "@/providers/ClientProviders";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Novel-DB</title>
        <meta name="description" content="A comprehensive database of novels" />
      </head>
      <body>
        <ClientProviders>
          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
