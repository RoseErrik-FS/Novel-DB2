'use client';

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../app/providers";
import { Navbar } from "@/components/navbar";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Providers>
        <Navbar />
        {children}
      </Providers>
    </SessionProvider>
  );
}
