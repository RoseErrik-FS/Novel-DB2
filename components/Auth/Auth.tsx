'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

interface AuthProps {
  isSignUp?: boolean;
}

const Auth: React.FC<AuthProps> = ({ isSignUp = false }) => {
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setIsLoading(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { redirect: false });
      setIsLoading(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      setIsLoading(false);
      setError('An error occurred while signing in with GitHub');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {status === 'authenticated' ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h2>
          <Spacer y={1} />
          <Button color="danger" onPress={handleSignOut}>
            {isLoading ? 'Loading...' : 'Sign Out'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {error && (
            <>
              <Spacer y={1} />
              <p className="text-red-500">{error}</p>
            </>
          )}
          <Spacer y={2} />
          <div className="flex justify-between w-full">
            <Button color="secondary" onPress={handleGithubSignIn} disabled={isLoading}>
              Sign In with GitHub
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
