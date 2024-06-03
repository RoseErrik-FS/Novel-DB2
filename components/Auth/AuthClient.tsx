// components\Auth\AuthClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Button, Spacer } from "@nextui-org/react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthClient: React.FC = () => {
  const searchParams = useSearchParams();
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("github", { redirect: false });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setError(
        "An error occurred while signing in with GitHub. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      setTimeout(() => {
        router.push(callbackUrl);
      }, 3000); // Display welcome message for 3 seconds before redirecting
    }
  }, [status, searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {status === "authenticated" ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Welcome, {session?.user?.name}!
          </h2>
          <Spacer y={1} />
        </div>
      ) : (
        <Card className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome to Novel-DB</h2>
            <Spacer y={1} />
          </div>
          {error && (
            <>
              <Spacer y={1} />
              <p className="text-red-500">{error}</p>
            </>
          )}
          <Spacer y={2} />
          <Button
            color="secondary"
            onPress={handleGithubSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign In with GitHub"}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AuthClient;
