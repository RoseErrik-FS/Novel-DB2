// components\Auth\AuthClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@nextui-org/react";
import Auth from "@/components/Auth/Auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const AuthClient: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const searchParams = useSearchParams();
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const form = searchParams.get("form");
    setIsSignUp(form === "register");
  }, [searchParams]);

  const toggleForm = () => {
    const newForm = isSignUp ? "login" : "register";
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("form", newForm);
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
    setIsSignUp(!isSignUp);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setIsLoading(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { redirect: false });
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setIsLoading(false);
      setError("An error occurred while signing in with GitHub");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {status === "authenticated" ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Welcome, {session?.user?.name}!
          </h2>
          <Spacer y={1} />
          <Button color="danger" onPress={handleSignOut}>
            {isLoading ? "Loading..." : "Sign Out"}
          </Button>
        </div>
      ) : (
        <Card className="w-full max-w-md">
          <Auth isSignUp={isSignUp} />
          <div className="mt-4 flex justify-center items-center">
            <p className="mr-2">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              className="bg-primary text-white py-2 px-4 rounded-md"
              onClick={toggleForm}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
          {error && (
            <>
              <Spacer y={1} />
              <p className="text-red-500">{error}</p>
            </>
          )}
          <Spacer y={2} />
          <div className="flex justify-between w-full">
            <Button
              color="secondary"
              onPress={handleGithubSignIn}
              disabled={isLoading}
            >
              Sign In with GitHub
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuthClient;
