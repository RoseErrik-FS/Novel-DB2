'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@nextui-org/react';
import Auth from '@/components/Auth/Auth';

const AuthClient: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const form = searchParams.get('form');
    setIsSignUp(form === 'register');
  }, [searchParams]);

  const toggleForm = () => {
    const newForm = isSignUp ? 'login' : 'register';
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('form', newForm);
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <Auth isSignUp={isSignUp} />
        <div className="mt-4 flex justify-center items-center">
          <p className="mr-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            className="bg-primary text-white py-2 px-4 rounded-md"
            onClick={toggleForm}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthClient;
