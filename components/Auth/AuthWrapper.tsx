// components\Auth\AuthWrapper.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      const callbackUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      router.push(`/Auth?form=login&callbackUrl=${callbackUrl}`); // Redirect to custom login page
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
