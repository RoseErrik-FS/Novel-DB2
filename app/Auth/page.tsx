import Head from 'next/head';
import { Suspense } from 'react';
import AuthClient from '@/components/Auth/AuthClient';
import { generateAuthMetadata } from '@/lib/GenerateMetadata';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const AuthPage = async () => {
  const metadata = await generateAuthMetadata(baseUrl);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthClient />
      </Suspense>
    </>
  );
};

export default AuthPage;
