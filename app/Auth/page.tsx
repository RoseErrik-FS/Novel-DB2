import Head from 'next/head';
import AuthClient from '@/components/Auth/AuthClient';
import { generateAuthMetadata } from '@/lib/GenerateMetadata';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const AuthPage = async () => {
  const metadata = await generateAuthMetadata();

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <AuthClient />
    </>
  );
};

export default AuthPage;
