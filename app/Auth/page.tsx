import { Suspense } from 'react';
import AuthClient from '@/components/Auth/AuthClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Auth Page',
  description: 'Login or register to access your account',
  keywords: 'login, register, authentication',
};

const AuthPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthClient />
      </Suspense>
    </>
  );
};

export default AuthPage;
